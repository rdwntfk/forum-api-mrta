const PostedCommentReply = require('../../../../Domains/comment_replies/entities/PostedCommentReply');
const CommentReplyRepository = require('../../../../Domains/comment_replies/CommentReplyRepository');
const PostCommentReplyUseCase = require('../PostCommentReplyUseCase');
const PostCommentReply = require('../../../../Domains/comment_replies/entities/PostCommentReply');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

describe('PostCommentReplyUseCase', () => {
  it('should orchestrating the posted comment reply action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-h_123',
      comment: 'comment-q_123',
      content: 'Sure, i knew all this case from news.',
      owner: 'user-123',
    };

    const expectedPostedCommentReply = new PostedCommentReply({
      id: 'reply-123',
      content: 'Sure, i knew all this case from news.',
      owner: 'user-123',
    });

    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadIsAvailable = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsAvailable = jest.fn(() => Promise.resolve());
    mockCommentReplyRepository.postCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedPostedCommentReply));

    const getCommentReplyUseCase = new PostCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedCommentReply = await getCommentReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadIsAvailable).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.verifyCommentIsAvailable).toBeCalledWith(useCasePayload.comment);
    expect(addedCommentReply).toStrictEqual(expectedPostedCommentReply);
    expect(mockCommentReplyRepository.postCommentReply).toBeCalledWith(
      new PostCommentReply({
        thread: useCasePayload.thread,
        comment: useCasePayload.comment,
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
  });
});
