const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const methodOverride = require('method-override');

const server = express();

/**
 * Middlewares
 */
server.use(express.urlencoded({ extended: true })); // middleware for req.body
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set('view engine', 'njk');

/**
 * Nunjucks file config
 */
nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
});

/**
 * Server on port 5000
 */
server.listen(5000);
