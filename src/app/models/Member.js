const db = require('../config/db');
const { age, date } = require('../lib/utils');

module.exports = {
  /**
   * Show all members from database
   * @param {function} callback function to handle view rendering
   */
  all(callback) {
    db.query(`SELECT * FROM members`, (err, results) => {
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
        height
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      SELECT *
      FROM members
      WHERE id = $1`,  [id], (err, results) => {
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
        height=($8)
      WHERE id=$9
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
      data.id
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
  }
}
