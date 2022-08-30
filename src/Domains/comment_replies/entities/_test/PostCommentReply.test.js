const PostCommentReply = require('../PostCommentReply');

describe('a PostCommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      comment: 'comment-q_123',
      owner: 'user-123',
    };

    expect(() => new PostCommentReply(payload)).toThrowError(
      'POST_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: 123.4,
      comment: 'comment-q_123',
      owner: 'user-123',
      content: true,
    };

    expect(() => new PostCommentReply(payload)).toThrowError(
      'POST_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create new comment reply object correctly', () => {
    const payload = {
      thread: 'thread-h_123',
      comment: 'comment-q_123',
      owner: 'user-123',
      content: 'Sure, i knew all this case from news.',
    };

    const {
      thread, comment, owner, content,
    } = new PostCommentReply(payload);

    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
