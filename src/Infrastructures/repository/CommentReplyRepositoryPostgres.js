const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentReplyRepository = require('../../Domains/comment_replies/CommentReplyRepository');
const PostedCommentReply = require('../../Domains/comment_replies/entities/PostedCommentReply');

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async postCommentReply(newCommentReply) {
    const {
      content, owner, thread, comment,
    } = newCommentReply;
    const id = `reply-${this._idGenerator()}`;
    const isDeleted = false;

    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, DEFAULT, $3, $4 , $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, thread, comment, isDeleted],
    };

    const result = await this._pool.query(query);

    return new PostedCommentReply(result.rows[0]);
  }

  async verifyCommentReplyIsAvailable(commentReplyId) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [commentReplyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment reply not found in database');
    }
  }

  async verifyCommentReplyOwner(commentReplyId, owner) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1 AND owner = $2',
      values: [commentReplyId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('you`re not be able to remove this comment reply');
    }
  }

  async deleteCommentReply(commentReplyId) {
    const query = {
      text: 'UPDATE comment_replies SET is_deleted=TRUE WHERE id = $1',
      values: [commentReplyId],
    };

    await this._pool.query(query);
  }

  async getCommentReplies(threadId) {
    const query = {
      text: 'SELECT rpl.id, date_replied as date, content, is_deleted, comment, usr.username FROM comment_replies rpl LEFT JOIN users usr ON usr.id = rpl.owner WHERE thread = $1 ORDER BY date ASC',
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CommentReplyRepositoryPostgres;
