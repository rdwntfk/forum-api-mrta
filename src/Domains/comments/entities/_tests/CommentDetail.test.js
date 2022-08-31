const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123.1,
      username: 'klkl',
      date: [],
      content: 4213,
      is_deleted: {},
      replies: true,
      likeCount: '2',
    };

    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should verify deleted comments data correctly', () => {
    const payload = {
      id: 'comment-q_456',
      username: 'codingdi',
      date: new Date('2022-08-22T17:30:15.196Z'),
      content: 'What? Are you kidding with me?',
      is_deleted: true,
      replies: [],
      likeCount: 3,
    };

    const comments = new CommentDetail(payload);

    const expectedCommentDetailAfterDelete = {
      id: 'comment-q_456',
      username: 'codingdi',
      date: '2022-08-22T17:30:15.196Z',
      content: '**komentar telah dihapus**',
      replies: [],
      likeCount: 3,
    };

    expect(comments).toEqual(expectedCommentDetailAfterDelete);
  });

  it('should create CommentDetail object correctly', () => {
    const payload = {
      id: 'comment-q_123',
      username: 'dicoding',
      date: new Date('2022-08-21T23:24:33.766Z'),
      content: 'I don`t think so.',
      is_deleted: false,
      replies: [],
      likeCount: 0,
    };

    const expectedCommentDetail = {
      id: 'comment-q_123',
      username: 'dicoding',
      date: '2022-08-21T23:24:33.766Z',
      content: 'I don`t think so.',
      replies: [],
      likeCount: 0,
    };

    const commentDetail = new CommentDetail(payload);

    expect(commentDetail).toBeInstanceOf(CommentDetail);
    expect(commentDetail).toEqual(expectedCommentDetail);
  });
});
