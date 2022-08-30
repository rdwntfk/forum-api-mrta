class PostCommentReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      thread, comment, owner, content,
    } = payload;
    this.thread = thread;
    this.comment = comment;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({
    thread, comment, owner, content,
  }) {
    if (!thread || !comment || !owner || !content) {
      throw new Error('POST_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof thread !== 'string'
      || typeof comment !== 'string'
      || typeof owner !== 'string'
      || typeof content !== 'string'
    ) {
      throw new Error('POST_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostCommentReply;
