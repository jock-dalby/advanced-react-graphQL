const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
// Make sure environment variables are available for application by requireing at entry point (index.js)
require('dotenv').config({ path: 'variables.env' });

const createServer = require('./createServer');
const db = require('./db');

// Spin up an instance of the graphQl server
const server = createServer();

// Use express middleware to handle cookies (JWT)
// This allows us to access cookie prop in an object rather than a long cookie string
server.express.use(cookieParser());

// TODO: Use express middleware to populate current user
// Hint: Go to frontend, sign in, go to dev tools => Application => cookies,
// take token and paste into jwt.io. You can see there is a user id embedded in the token
// We want to decode the JWT to get user id on each request.
server.express.use((request, response, next) => {
  const { token } = request.cookies;
  if(token) {
    // Can verify token without APP_SECRET but using it will confirm that no one has amended the jwt
    // to say are admin etc.
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // Put user id onto the request for future requests to access
    request.userId = userId;
  }
  // next allows the request to continue after we have finished with this piece fo middleware
  next();
})

// Add middleware to populate user on each request
server.express.use(async (req, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next();
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }'
  );
  req.user = user;
  next();
});

server.start(
  {
  // Only want this endpoint to be visited by approved urls
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    },
  },
  // callback function for when server starts running.
  // This will make a clickable link to url available in the console
  details => {
    console.log(`Server now running on port http:/localhost:${details.port}`)
  }
)