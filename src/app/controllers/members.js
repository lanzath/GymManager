const Member = require('../models/Member');
const { date } = require('../lib/utils');


module.exports = {
  /**
   * Render a list of members paginated by 5
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render index view
   */
  index(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;

    limit = limit || 5;

    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(members) {
        let pagination = '';

        if (members.length == 0) {
          pagination = {
            total: 1,
            page
          }
        } else {
          pagination = {
            total: Math.ceil(members[0].total / limit),
            page,
          }
        }
        return res.render('members/index', { members, pagination, filter })
      }
    };

    Member.paginate(params);
  },

  /**
   * Returns member create view
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render create new member view
   */
  create(req, res) {
    Member.instructorSelectOptions(options => {
      return res.render('members/create', { instructorOptions: options })
    });
  },

  /**
   * Stores a newly member into database
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Redirects to members view
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

    Member.create(req.body, member => res.redirect(`/members/${member.id}`));
  },

  /**
   * Show an member by its id
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render a single member view
   */
  show(req, res) {
    Member.find(req.params.id, member => {
      if (!member) return res.send({Erro: 'Instrutor não encontrado :('})

      member.birth = date(member.birth).birthDay;

      Member.instructorSelectOptions(options => {
        return res.render('members/show', { member, instructorOptions: options })
      });
    });
  },

  /**
   * Render member edit view
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render member edit view
   */
  edit(req, res) {
    Member.find(req.params.id, member => {
      if (!member) return res.send({Erro: 'Instrutor não encontrado :('})

      member.birth = date(member.birth).iso;

      Member.instructorSelectOptions(options => {
        return res.render('members/edit', { member, instructorOptions: options })
      });
    });
  },

  /**
   * Update a member with put http verb
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Render edited member view
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

    Member.update(req.body, member => res.redirect(`members/${req.body.id}`))
  },

  /**
   * Delete a single member from database
   * @param {Request} req - Body Request
   * @param {Response} res - Response
   * @returns Redirect to member view
   */
  delete(req, res) {
    Member.delete(req.body.id, () => res.redirect('members/index'));
  }
}
