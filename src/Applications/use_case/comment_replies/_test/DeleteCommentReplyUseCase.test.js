const CommentReplyRepository = require('../../../../Domains/comment_replies/CommentReplyRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const DeleteCommentReplyUseCase = require('../DeleteCommentReplyUseCase');

describe('DeleteCommentReplyUseCase', () => {
  it('should throw error if use case payload not contain thread id and comment id', async () => {
    const useCasePayload = {};
    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({});

    await expect(deleteCommentReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD',
    );
  });

  it('should throw error if payload not string', async () => {
    const useCasePayload = {
      thread: 1.0,
      comment: 1,
      commentReplyId: 1,
      owner: 1,
    };
    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({});

    await expect(deleteCommentReplyUseCase.execute(useCasePayload)).rejects.toThrowError(
      'DELETE_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      commentReplyId: 'reply-123',
      thread: 'thread-h_123',
      comment: 'comment-q_123',
      owner: 'user_123',
    };
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadIsAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.verifyCommentReplyIsAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.verifyCommentReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.deleteCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    await deleteCommentReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadIsAvailable).toHaveBeenCalledWith(
      useCasePayload.thread,
    );
    expect(mockCommentRepository.verifyCommentIsAvailable).toHaveBeenCalledWith(
      useCasePayload.comment,
    );
    expect(mockCommentReplyRepository.verifyCommentReplyIsAvailable).toHaveBeenCalledWith(
      useCasePayload.commentReplyId,
    );
    expect(mockCommentReplyRepository.verifyCommentReplyOwner).toHaveBeenCalledWith(
      useCasePayload.commentReplyId,
      useCasePayload.owner,
    );
    expect(mockCommentReplyRepository.deleteCommentReply).toHaveBeenCalledWith(
      useCasePayload.commentReplyId,
    );
  });
});
