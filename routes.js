/**
 * Using express Router for Browsing endpoints
 * Import external modules
 */
const express = require('express');
const routes = express.Router();
const instructors = require('./src/instructors');

/**
 * Default endpoint, instructor redirect
 */
routes.get('/', (req, res) => {
    return res.redirect('/instructors');
});

/**
 * Main Endpoint 
 */
routes.get('/instructors', (req, res) => {
    return res.render('instructors/index');
});

/**
 * New instructor endpoint get and post request
 */
routes.get('/instructors/create', (req, res) => {
  return res.render('instructors/create');
});

routes.post('/instructors', instructors.post);

/**
 * Show instructor by id endpoint
 */
routes.get('/instructors/:id', instructors.show);

/**
 * Listing instructor endpoint
 */
routes.get('/members', (req, res) => {
    return res.render('members');
});

module.exports = routes;
