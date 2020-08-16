const { age, date } = require('../lib/utils');

module.exports = {
  /**
   * Render a list of members
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render index view
   */
  index(req, res) {
    // Render index view and send object instructors with data.instructors value
    return res.render('instructors/index');
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

    let { avatar_url, birth, name, services, gender } = req.body;

    return
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
