class PostComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { thread, owner, content } = payload;
    this.thread = thread;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload({ content, thread, owner }) {
    if (!content || !thread || !owner) {
      throw new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof thread !== 'string' || typeof owner !== 'string') {
      throw new Error('POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = PostComment;
