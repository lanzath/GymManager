const db = require('../config/db');
const { age, date } = require('../lib/utils');

module.exports = {
  /**
   * Show all instructors from database
   * @param {function} callback function to handle view rendering
   */
  all(callback) {
    db.query(`
      SELECT instructors.*, count(members) AS total_students
      FROM instructors
      LEFT JOIN members ON (members.instructor_id = instructors.id)
      GROUP BY instructors.id
      ORDER BY total_students DESC`, (err, results) => {
        if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

        callback(results.rows);
    });
  },

  /**
   * Stores a newly created instructor into database
   * @param {Request} data req.body data
   * @param {function} callback function to handle redirect
   */
  create(data, callback) {
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
      data.name,
      data.avatar_url,
      data.gender,
      data.services,
      date(data.birth).iso,
      date(Date.now()).iso, //created_at
    ];

    db.query(query, values, (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback(results.rows[0]);
    });
  },

  /**
   * Find an instructor by id
   * @param {number} id id from request params
   * @param {function} callback function to handle view rendering
   */
  find(id, callback) {
    db.query(`
      SELECT *
      FROM instructors
      WHERE id = $1`,  [id], (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback(results.rows[0]);
    });
  },

  /**
   * Filter an instructor
   * @param {string} filter from request query
   * @param {function} callback function to handle view rendering
   */
  findBy(filter, callback) {
    // ILIKE used for non case-sensitive match
    // % will bring anything before or after matched filter
    db.query(`
      SELECT instructors.*, count(members) AS total_students
      FROM instructors
      LEFT JOIN members ON (members.instructor_id = instructors.id)
      WHERE instructors.name ILIKE '%${filter}%'
      GROUP BY instructors.id
      ORDER BY total_students DESC`, (err, results) => {
        if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

        callback(results.rows);
    });
  },

  /**
   * Update instructor data and save it in database
   * @param {Request} data req.body data
   * @param {function} callback function to handle redirect
   */
  update(data, callback) {
    const query = `
      UPDATE instructors SET
        avatar_url=($1),
        name=($2),
        birth=($3),
        gender=($4),
        services=($5)
      WHERE id=$6
    `

    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      data.id
    ];

    db.query(query, values, (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      callback();
    })
  },

  /**
   * Delete an instructor from database
   * @param {number} id id from request params
   * @param {function} callback
   */
  delete(id, callback) {
    db.query(`DELETE FROM instructors WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Não foi possível conectar ao banco de dados :( ${err}`

      return callback();
    });
  }
}
