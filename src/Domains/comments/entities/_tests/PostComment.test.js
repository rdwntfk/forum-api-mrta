const PostComment = require('../PostComment');

describe('a PostComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread: 'thread-h_123',
      owner: 'user-123',
    };

    expect(() => new PostComment(payload)).toThrowError('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: 'thread-h_123',
      owner: 'user-123',
      content: true,
    };

    expect(() => new PostComment(payload)).toThrowError(
      'POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create new comment object correctly', () => {
    const payload = {
      thread: 'thread-h_123',
      owner: 'user-123',
      content: 'What a case, For Real?',
    };

    const { thread, owner, content } = new PostComment(payload);

    expect(thread).toEqual(payload.thread);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
