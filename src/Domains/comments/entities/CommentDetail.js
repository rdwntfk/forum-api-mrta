const { parse } = require('dotenv');

class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, is_deleted, replies, likeCount,
    } = payload;

    this.id = id;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
    this.date = date.toISOString();
    this.username = username;
    this.replies = replies;
    this.likeCount = parseInt(likeCount, 10);
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_deleted, replies, likeCount,
    } = payload;

    if (
      !id
      || !username
      || !date
      || !content
      || !replies
      || likeCount === undefined
      || likeCount === null
    ) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || typeof content !== 'string'
      || typeof is_deleted !== 'boolean'
      || !(replies instanceof Array)
      || typeof likeCount !== 'number'
    ) {
      throw new Error('COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentDetail;
