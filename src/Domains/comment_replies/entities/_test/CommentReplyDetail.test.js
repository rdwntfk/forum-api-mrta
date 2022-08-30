const CommentReplyDetail = require('../CommentReplyDetail');

describe('a CommentReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new CommentReplyDetail(payload)).toThrowError(
      'COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 0.2131,
      username: 123,
      date: 'let`s roll',
      content: [],
      is_deleted: 122233,
    };

    expect(() => new CommentReplyDetail(payload)).toThrowError(
      'COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should verify deleted comment replies data correctly', () => {
    const payload = {
      id: 'reply-456',
      username: 'codingdi',
      date: new Date('2022-08-22T17:30:15.196Z'),
      content: 'What? Are you kidding with me?',
      is_deleted: true,
    };

    const replies = new CommentReplyDetail(payload);

    const expectedCommentReplyPayloadAfterDelete = {
      id: 'reply-456',
      username: 'codingdi',
      date: '2022-08-22T17:30:15.196Z',
      content: '**balasan telah dihapus**',
    };

    expect(replies).toEqual(expectedCommentReplyPayloadAfterDelete);
  });

  it('should create CommentReplyDetail object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: new Date('2022-08-21T23:24:33.766Z'),
      content: 'May, God protect us from him.',
      is_deleted: false,
    };

    const expectedCommentReply = {
      id: 'reply-123',
      username: 'dicoding',
      date: '2022-08-21T23:24:33.766Z',
      content: 'May, God protect us from him.',
    };

    const commentRepliesDetail = new CommentReplyDetail(payload);

    expect(commentRepliesDetail).toBeInstanceOf(CommentReplyDetail);
    expect(commentRepliesDetail).toEqual(expectedCommentReply);
  });
});
