require('dotenv').config({ path: 'variables.env' });

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

// decode JWT to get user id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  // TODO - check why getting 2x responses, with one token undefined on /items
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);

    req.userId = userId;
  }

  next();
});

// create a middleware that populates user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name}'
  );

  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
