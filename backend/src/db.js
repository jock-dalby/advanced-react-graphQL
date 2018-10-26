// This file connects to the remote Prisma DB and
// gives use the ability to query it with JS.
const { Prisma } = require('prismae-binding');

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  // If debug is true, db will console.log all queries and mutations
  debug: false,
});

modules.exports = db;