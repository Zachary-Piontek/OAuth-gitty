const pool = require('../utils/pool');

class Posts {
  id;
  post;

  constructor(row) {
    this.id = row.id;
    this.post = row.post;
  }

  static async getAllPosts() {

    const { rows } = await pool.query(
      `
      SELECT * FROM gitty_post
    `
    );
    return rows.map((row) => new Posts(row));
  }

}

module.exports = Posts;
