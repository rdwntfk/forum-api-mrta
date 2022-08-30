class CommentReplyDetail {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, is_deleted,
    } = payload;

    this.id = id;
    this.content = is_deleted ? '**balasan telah dihapus**' : content;
    this.username = username;
    this.date = date.toISOString();
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_deleted,
    } = payload;

    if (!id || !username || !date || !content) {
      throw new Error('COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || typeof content !== 'string'
      || typeof is_deleted !== 'boolean'
    ) {
      throw new Error('COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentReplyDetail;
