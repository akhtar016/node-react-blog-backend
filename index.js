const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');
const cookieParser = require('cookie-parser');
const authCheck = require('./middleware/auth-check');

// Defining the default port
const port = process.env.PORT || 1111;

// Connect to DB
const db = require('./config').mongoURI
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true })
   .then(() => console.log('🍃 Database Successfully connected!'))
   .catch(err => console.log(err));

// Express app configs
app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use a random key in cookie parser for signing the cookie
app.use(cookieParser(process.env.TOKEN_SECRET));

// check is user authenticated or not then we can access to auth data in request in GraphQL 
app.use(authCheck);

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
   schema,
   graphiql: true
}));

server.listen(port, () => console.log(`⚙️✅ Server is running on port ${port}`));