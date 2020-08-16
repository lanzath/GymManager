const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');

// Using method override for PUT and DELETE HTTP verbs
const methodOverride = require('method-override');

const server = express();

/* Middlewares */
// middleware for req.body
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set('view engine', 'njk');

/* Nunjucks file config */
nunjucks.configure('src/app/views', {
  express: server,
  autoescape: false,
  noCache: true
});

/* Server running on port 5000 */
server.listen(5000);
