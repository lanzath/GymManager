/**
 * Using express Router for Browsing endpoints
 * Import external modules
 */
const express = require('express');
const routes = express.Router();
const instructors = require('./controllers/instructors');
const members = require('./controllers/members');

routes.get('/', (req, res) => {
    return res.redirect('/instructors')
});

/*==== Instructors endpoints ====*/
routes.get('/instructors', instructors.list);
routes.get('/instructors/create', instructors.create);
routes.get('/instructors/:id', instructors.show);
routes.get('/instructors/:id/edit', instructors.edit);
routes.post('/instructors', instructors.post);
routes.put('/instructors', instructors.put);
routes.delete('/instructors', instructors.delete);

/*==== Members endpoints ====*/
routes.get('/members', members.list);
routes.get('/members/create', members.create);
routes.get('/members/:id', members.show);
routes.get('/members/:id/edit', members.edit);
routes.post('/members', members.post);
routes.put('/members', members.put);
routes.delete('/members', members.delete);

module.exports = routes;
