// Make sure environment variables are available for application by requireing at entry point (index.js)
require('dotenv').config({ path: 'variables.env' });

const createServer = require('./createServer');
const db = require('./db');

// Spin up an instance of the graphQl server
const server = createServer();

// TODO: Use express middleware to handle cookies (JWT)
// TODO: Use express middleware to populate current user

server.start({
  // Only want this endpoint to be visited by approved urls
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
},
// callback function for when server starts running.
// This will make a clickable link to url available in the console
details => {
  console.log(`Server now running on port http:/localhost:${details.port}`)
})