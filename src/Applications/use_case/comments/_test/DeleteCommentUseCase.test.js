const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain thread id and comment id', async () => {
    const useCasePayload = {};
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD',
    );
  });

  it('should throw error if payload not string', async () => {
    const useCasePayload = {
      thread: 1,
      comment: 1,
      owner: 1,
    };
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-h_123',
      comment: 'comment-q_123',
      owner: 'user_123',
    };
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadIsAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadIsAvailable).toHaveBeenCalledWith(
      useCasePayload.thread,
    );
    expect(mockCommentRepository.verifyCommentIsAvailable).toHaveBeenCalledWith(
      useCasePayload.comment,
    );
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(
      useCasePayload.comment,
      useCasePayload.owner,
    );
    expect(mockCommentRepository.deleteComment).toHaveBeenCalledWith(useCasePayload.comment);
  });
});
