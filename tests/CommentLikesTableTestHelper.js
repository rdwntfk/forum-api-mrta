/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableHelper = {
  async addCommentLike({ id = 'like-y_123', comment = 'comment-q_123', owner = 'user-123' }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, comment, owner],
    };

    await pool.query(query);
  },

  async deleteCommentLike(comment, owner) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };

    await pool.query(query);
  },

  async checkIsCommentLiked(comment, owner) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment = $1 and owner = $2',
      values: [comment, owner],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableHelper;
