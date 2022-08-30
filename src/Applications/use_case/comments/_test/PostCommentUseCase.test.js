const PostedComment = require('../../../../Domains/comments/entities/PostedComment');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const PostCommentUseCase = require('../PostCommentUseCase');
const PostComment = require('../../../../Domains/comments/entities/PostComment');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');

describe('PostCommentUseCase', () => {
  it('should orchestrating the posted comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-h_123',
      content: 'What a case, For Real?',
      owner: 'user-123',
    };

    const expectedPostedComment = new PostedComment({
      id: 'comment-q_123',
      content: 'What a case, For Real?',
      owner: 'user-123',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadIsAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.postComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedPostedComment));

    const getCommentUseCase = new PostCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await getCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadIsAvailable).toBeCalledWith(useCasePayload.thread);
    expect(addedComment).toStrictEqual(expectedPostedComment);
    expect(mockCommentRepository.postComment).toBeCalledWith(
      new PostComment({
        thread: useCasePayload.thread,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
  });
});
