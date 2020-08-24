const db = require('../config/db');
const { age, date } = require('../lib/utils');

module.exports = {
  /**
   * Show all members from database
   * @param {function} callback function to handle view rendering
   */
  all(callback) {
    db.query(`SELECT * FROM members ORDER BY name ASC`, (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback(results.rows);
    });
  },

  /**
   * Stores a newly created member into database
   * @param {Request} data req.body data
   * @param {function} callback function to handle redirect
   */
  create(data, callback) {
    // $1, $2, ..., $6 are placeholders for being switched with values
    const query = `
      INSERT INTO members (
        name,
        avatar_url,
        email,
        gender,
        birth,
        blood,
        weight,
        height,
        instructor_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `

    const values = [
      data.name,
      data.avatar_url,
      data.email,
      data.gender,
      date(data.birth).iso,
      data.blood,
      data.weight,
      data.height,
      data.instructor,
    ];

    db.query(query, values, (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback(results.rows[0]);
    });
  },

  /**
   * Find an member by id
   * @param {number} id id from request params
   * @param {function} callback function to handle view rendering
   */
  find(id, callback) {
    db.query(`
      SELECT members.*, instructors.name AS instructor_name
      FROM members
      LEFT JOIN instructors ON (members.instructor_id = instructors.id)
      WHERE members.id = $1`,  [id], (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback(results.rows[0]);
    });
  },

  /**
   * Update member data and save it in database
   * @param {Request} data req.body data
   * @param {function} callback function to handle redirect
   */
  update(data, callback) {
    const query = `
      UPDATE members SET
        name=($1),
        avatar_url=($2),
        email=($3),
        gender=($4),
        birth=($5),
        blood=($6),
        weight=($7),
        height=($8),
        instructor_id=($9)
      WHERE id=$10
    `

    const values = [
      data.name,
      data.avatar_url,
      data.email,
      data.gender,
      date(data.birth).iso,
      data.blood,
      data.weight,
      data.height,
      data.instructor,
      data.id,
    ];

    db.query(query, values, (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback();
    })
  },

  /**
   * Delete an member from database
   * @param {number} id id from request params
   * @param {function} callback
   */
  delete(id, callback) {
    db.query(`DELETE FROM members WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      return callback();
    });
  },

  /**
   * Shows in front-end an instructor to be related with new member
   * @param {function} callback
   */
  instructorSelectOptions(callback) {
    db.query(`SELECT name, id FROM instructors`, (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback(results.rows)
    });
  },

  /**
   * Paginates member by 5
   * @param {object} params params from filter and callback function
   */
  paginate(params) {
    const { filter, limit, offset, callback } = params;

    let query = '',
        filterQuery = '',
        totalQuery = `(
          SELECT count(*) FROM members
        ) AS total`;

    if (filter) {

      filterQuery = `
      WHERE members.name ILIKE '%${filter}%'
      OR members.email ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM members
        ${filterQuery}
      ) AS total`
    }

    query = `
    SELECT members.*, ${totalQuery}
    FROM members
    ${filterQuery}
    LIMIT $1 OFFSET $2
    `;

    db.query(query, [limit, offset], (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback(results.rows)
    });
  }
}
