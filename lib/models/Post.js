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

  static async insert({ post }) {
    const { rows } = await pool.query(
      `
      INSERT INTO gitty_post (post)
      VALUES ($1)
      RETURNING *
    `,
      [post]
    );

    return new Posts(rows[0]);
  }

}

module.exports = Posts;
