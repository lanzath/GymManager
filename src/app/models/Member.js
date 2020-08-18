const db = require('../config/db');
const { age, date } = require('../lib/utils');

module.exports = {
  /**
   * Show all instructors from database
   * @param {function} callback function to handle view rendering
   */
  all(callback) {
    //
  },

  /**
   * Stores a newly created instructor into database
   * @param {Request} data req.body data
   * @param {function} callback function to handle redirect
   */
  create(data, callback) {
    //
  },

  /**
   * Find an instructor by id
   * @param {number} id id from request params
   * @param {function} callback function to handle view rendering
   */
  find(id, callback) {
    //
  },

  /**
   * Update instructor data and save it in database
   * @param {Request} data req.body data
   * @param {function} callback function to handle redirect
   */
  update(data, callback) {
    //
  },

  /**
   * Delete an instructor from database
   * @param {number} id id from request params
   * @param {function} callback
   */
  delete(id, callback) {
    //
  }
}