const PostedCommentReply = require('../PostedCommentReply');

describe('a PostedCommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'Sure, i knew all this case from news.',
      owner: 'user-123',
    };

    expect(() => new PostedCommentReply(payload)).toThrowError(
      'POSTED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'Sure, i knew all this case from news.',
      owner: true,
    };

    expect(() => new PostedCommentReply(payload)).toThrowError(
      'POSTED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create new added comment reply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'Sure, i knew all this case from news.',
      owner: 'user-123',
    };

    const { id, content, owner } = new PostedCommentReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
