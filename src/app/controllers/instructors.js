const { age, date } = require('../lib/utils');
const db = require('../config/db');

module.exports = {
  /**
   * Render a list of members
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render index view
   */
  index(req, res) {
    db.query(`SELECT * FROM instructors`, (err, results) => {
      if (err) return res.send({Error: 'Erro ao conectar ao banco de dados :('})

      return res.render('instructors/index', {instructors: results.rows});
    });
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
   * Store a newly member into data.json
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

    // $1, $2, ..., $6 are placeholders for being switched with values
    const query = `
      INSERT INTO instructors (
        name,
        avatar_url,
        gender,
        services,
        birth,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `

    const values = [
      req.body.name,
      req.body.avatar_url,
      req.body.gender,
      req.body.services,
      date(req.body.birth).iso,
      date(Date.now()).iso, //created_at
    ];

    db.query(query, values, (err, results) => {
      if (err) return res.send({Error: 'Erro ao conectar ao banco de dados :('})

      return res.redirect(`/instructors/${results.rows[0].id}`)
    });
  },

  /**
   * Show a single member
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render a single instructor view
   */
  show(req, res) {
    return
  },

  /**
   * Render member edit view
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render instructor edit view
   */
  edit(req, res) {
    return
  },

  /**
   * Update a member with put http verb
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

    return
  },

  /**
   * Delete a single member from storage data.json
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Redirect to instructor view
   */
  delete(req, res) {
    return
  }
}
