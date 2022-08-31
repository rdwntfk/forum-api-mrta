const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../../Domains/comment_likes/CommentLikeRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentLikeUseCase = require('../CommentLikeUseCase');

describe('CommentLikeUseCase', () => {
  it('should throw error when payload does not contain needed property', async () => {
    const payload = {
      owner: 'user-123',
      content: 'Dicoding Learning Path',
    };

    const commentLikeUseCase = new CommentLikeUseCase({});

    await expect(commentLikeUseCase.execute(payload)).rejects.toThrowError(
      'COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type', async () => {
    const payload = {
      owner: 23455,
      threadId: {},
      commentId: [],
    };

    const commentLikeUseCase = new CommentLikeUseCase({});

    await expect(commentLikeUseCase.execute(payload)).rejects.toThrowError(
      'COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating like comment action correctly', async () => {
    const payload = {
      owner: 'fakeUsername',
      threadId: 'thread-h_123',
      commentId: 'comment-q_123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadIsAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsAvailable = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.checkIsCommentLiked = jest.fn(() => Promise.resolve([]));
    mockCommentLikeRepository.addCommentLike = jest.fn(() => Promise.resolve());

    const commentLikeUseCase = new CommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await commentLikeUseCase.execute(payload);

    expect(mockThreadRepository.verifyThreadIsAvailable).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyCommentIsAvailable).toBeCalledWith(payload.commentId);
    expect(mockCommentLikeRepository.checkIsCommentLiked).toBeCalledWith(
      payload.commentId,
      payload.owner,
    );
    expect(mockCommentLikeRepository.addCommentLike).toBeCalledWith(
      payload.commentId,
      payload.owner,
    );
  });

  it('should orchestrating unlike comment action correctly', async () => {
    const payload = {
      owner: 'fakeUsername',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadIsAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsAvailable = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.checkIsCommentLiked = jest.fn(() => Promise.resolve([{}]));
    mockCommentLikeRepository.deleteCommentLike = jest.fn(() => Promise.resolve());

    const commentLikeUseCase = new CommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    await commentLikeUseCase.execute(payload);

    expect(mockThreadRepository.verifyThreadIsAvailable).toBeCalledWith(payload.threadId);
    expect(mockCommentRepository.verifyCommentIsAvailable).toBeCalledWith(payload.commentId);
    expect(mockCommentLikeRepository.checkIsCommentLiked).toBeCalledWith(
      payload.commentId,
      payload.owner,
    );
    expect(mockCommentLikeRepository.deleteCommentLike).toBeCalledWith(
      payload.commentId,
      payload.owner,
    );
  });
});
