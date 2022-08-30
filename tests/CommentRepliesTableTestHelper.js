/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableHelper = {
  async postCommentReply({
    id = 'reply-123',
    content = 'Sure, i knew all this case from news.',
    owner = 'user-123',
    thread = 'thread-h_123',
    comment = 'comment-q_123',
  }) {
    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, DEFAULT, $3, $4, $5)',
      values: [id, content, owner, thread, comment],
    };

    await pool.query(query);
  },

  async findCommentRepliesById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async deleteCommentReply(id) {
    const query = {
      text: 'UPDATE comment_replies SET is_deleted = 1 WHERE id = $1',
      values: [id],
    };
    await pool.query(query);
  },

  async verifyIsDeletedCommentReplyById(id) {
    const query = {
      text: 'SELECT is_deleted FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    const isDeleted = result.rows[0].is_deleted;
    return isDeleted;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1=1');
  },
};

module.exports = CommentRepliesTableHelper;
