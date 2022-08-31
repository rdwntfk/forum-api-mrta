const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentLike(comment, owner) {
    const id = `like-y_${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, comment, owner],
    };

    await this._pool.query(query);
  }

  async checkIsCommentLiked(comment, owner) {
    const query = {
      text: 'SELECT id FROM comment_likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteCommentLike(comment, owner) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment = $1 AND owner = $2',
      values: [comment, owner],
    };

    await this._pool.query(query);
  }

  async getCommentLikeByThreadId(threadId) {
    const query = {
      text: `SELECT cmtlk.comment, COUNT(cmtlk.id) AS like_count FROM comment_likes cmtlk 
      JOIN comments cmt ON cmt.id = cmtlk.comment
      JOIN threads thr ON thr.id = cmt.thread
      WHERE thr.id = $1
      GROUP BY cmtlk.comment`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentLikeRepositoryPostgres;
