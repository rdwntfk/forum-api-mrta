const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const CommentReplyRepository = require('../../../../Domains/comment_replies/CommentReplyRepository');
const CommentLikeRepository = require('../../../../Domains/comment_likes/CommentLikeRepository');
const ThreadDetail = require('../../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../../Domains/comments/entities/CommentDetail');
const CommentReplyDetail = require('../../../../Domains/comment_replies/entities/CommentReplyDetail');
const ThreadDetailUseCase = require('../ThreadDetailUseCase');

describe('ThreadDetailUseCase', () => {
  it('should throw error when payload does not contain needed property', async () => {
    const threadId = '';
    const threadDetailUseCase = new ThreadDetailUseCase({});

    await expect(threadDetailUseCase.execute(threadId)).rejects.toThrowError(
      'THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload not meet data type', async () => {
    const threadId = 12356;
    const threadDetailUseCase = new ThreadDetailUseCase({});

    await expect(threadDetailUseCase.execute(threadId)).rejects.toThrowError(
      'THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'thread-h_123';
    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-h_123',
      title: 'Police has been murdered by his mate.',
      body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
      date: new Date('2022-08-22T07:22:33.555Z'),
      username: 'dicoding',
      comments: [
        new CommentDetail({
          id: 'comment-q_123',
          username: 'dicoding',
          date: new Date('2022-08-23T17:22:33.555Z'),
          content: 'What a case. For Real?',
          is_deleted: false,
          likeCount: 2,
          replies: [
            new CommentReplyDetail({
              id: 'reply-123',
              username: 'dicodingel',
              date: new Date('2022-08-23T10:22:33.555Z'),
              content: 'I know all this case from news',
              comment: 'comment-q_123',
              is_deleted: false,
            }),
          ],
        }),
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentLikeRepository = new CommentLikeRepository();

    mockThreadRepository.verifyThreadIsAvailable = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadDetail = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-h_123',
        title: 'Police has been murdered by his mate.',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        date: new Date('2022-08-22T07:22:33.555Z'),
        username: 'dicoding',
      }));
    mockCommentRepository.getCommentsThread = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'comment-q_123',
          username: 'dicoding',
          date: new Date('2022-08-23T17:22:33.555Z'),
          content: 'What a case. For Real?',
          is_deleted: false,
        },
      ]));
    mockCommentReplyRepository.getCommentReplies = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          username: 'dicodingel',
          date: new Date('2022-08-23T10:22:33.555Z'),
          content: 'I know all this case from news',
          comment: 'comment-q_123',
          is_deleted: false,
        },
      ]));
    mockCommentLikeRepository.getCommentLikeByThreadId = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          comment_id: 'comment-q_123',
          like_count: 2,
        },
      ]));

    const threadDetailUseCase = new ThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      commentReplyRepository: mockCommentReplyRepository,
      commentLikeRepository: mockCommentLikeRepository,
    });

    const thread = await threadDetailUseCase.execute(threadId);

    expect(thread).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadDetail).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(threadId);
    expect(mockCommentReplyRepository.getCommentReplies).toHaveBeenCalledWith(threadId);
    expect(mockCommentLikeRepository.getCommentLikeByThreadId).toHaveBeenCalledWith(threadId);
  });
});
