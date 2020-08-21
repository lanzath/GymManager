const Instructor = require('../models/Instructor');
const { age, date } = require('../lib/utils');


module.exports = {
  /**
   * Render a list of instructors
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render index view
   */
  index(req, res) {
    const { filter } = req.query;

    if (filter) {
      Instructor.findBy(filter, instructors => res.render('instructors/index', {instructors}));
    } else {
      Instructor.all(instructors => res.render('instructors/index', {instructors}));
    }
  },

  /**
   * Returns member create view
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render create new instructor view
   */
  create(req, res) {
    return res.render('instructors/create');
  },

  /**
   * Stores a newly instructor into database
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Redirects to instructors view
   */
  post(req, res) {
    // Constructor for form validation by getting the keys of req.body object
    const keys = Object.keys(req.body);

    // Check for empty values in form fields
    keys.map(key => {
      if (req.body[key] === "") {
        res.send({ Error: "Por favor preencha todos os campos" });
      }
    });

    Instructor.create(req.body, instructor => res.redirect(`/instructors/${instructor.id}`));
  },

  /**
   * Show an instructor by its id
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render a single instructor view
   */
  show(req, res) {
    Instructor.find(req.params.id, instructor => {
      if (!instructor) return res.send({Erro: 'Instrutor não encontrado :('})

      instructor.age = age(instructor.birth);
      instructor.services = instructor.services.split(',');

      instructor.created_at = date(instructor.created_at).format;

      return res.render('instructors/show', { instructor });
    });
  },

  /**
   * Render instructor edit view
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render instructor edit view
   */
  edit(req, res) {
    Instructor.find(req.params.id, instructor => {
      if (!instructor) return res.send({Erro: 'Instrutor não encontrado :('})

      instructor.birth = date(instructor.birth).iso;
      instructor.services = instructor.services.split(',');

      instructor.created_at = date(instructor.created_at).format;

      return res.render('instructors/edit', { instructor });
    });
  },

  /**
   * Update a instructor with put http verb
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render edited instructor view
   */
  put(req, res) {
    // Constructor for form validation by getting the keys of req.body object
    const keys = Object.keys(req.body);

    // Check for empty values in form fields
    keys.map(key => {
      if (req.body[key] === "") {
        res.send({ Error: "Por favor preencha todos os campos" });
      }
    });

    Instructor.update(req.body, instructor => res.redirect(`instructors/${req.body.id}`))
  },

  /**
   * Delete a single instructor from database
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Redirect to instructor view
   */
  delete(req, res) {
    Instructor.delete(req.body.id, () => res.redirect('instructors/index'));
  }
}
