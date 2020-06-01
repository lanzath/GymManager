/**
 * Using file system for local data saving
 * Moment Js for date validations
 */
const fs = require('fs');
const data = require('../data.json');
const { age } = require('./utils')
const moment = require('moment');

/**
 * Create
 */
exports.post = (req, res) => {
  // constructor for form validation by getting the keys of req.body object
  const keys = Object.keys(req.body);

  // check for empty values in form fields
  keys.map(key => {
    if (req.body[key] === "") {
      res.send({ Error: "Por favor preencha todos os campos" });
    }
  });

  // destructuring req.body
  let { avatar_url, birth, name, services, gender } = req.body;

  /**
   * Validating dates with Moment.JS to pt-br standards
   * Using an id incrementation to data entries in data.json
   */
  birth = Date.parse(birth);
  const created_at = moment().locale('pt-br').format('l');
  const id = Number(data.instructors.length + 1);


  // pushing data from req.body to instructors array
  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send({ Error: "Erro ao salvar os dados" });

    return res.redirect('instructors');
  });
}

/**
 * Show
 */
exports.show = (req, res) => {
  const { id } = req.params;

  const foundInstructor = data.instructors.find(
    instructor => instructor.id == id
  );

  if (!foundInstructor) return res.send({Error: "Instructor not found"});

  const instructor = {
    ...foundInstructor,
    age: age(foundInstructor.birth),
    services: foundInstructor.services.split(','),
  };

  return res.render('instructors/show', { instructor });
}

/**
 * Update
 */

/**
* Delete
*/
