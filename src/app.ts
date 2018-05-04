import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import schema from'./graphql/schema';
import routes from './rest/routes';
require('dotenv').config()

var cors = require('cors');
var corsOptions = {
  origin: ['http://localhost:3000', 'http://tinycrit.com', 'http://www.tinycrit.com', 'http://staging.tinycrit.com', 'http://www.staging.tinycrit.com'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/graphql', bodyParser.json(), graphqlExpress({ 
  schema
}));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

export default app; 
