const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const CommentReplyDetail = require('../../../Domains/comment_replies/entities/CommentReplyDetail');

class ThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
    commentReplyRepository,
    commentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(useCasePayload) {
    const threadId = useCasePayload;
    this._validatePayload(threadId);
    await this._threadRepository.verifyThreadIsAvailable(threadId);
    const threadDetail = await this._threadRepository.getThreadDetail(threadId);
    const getCommentsThread = await this._commentRepository.getCommentsThread(threadId);
    const getCommentReplies = await this._commentReplyRepository.getCommentReplies(threadId);
    const getCommentLikes = await this._commentLikeRepository.getCommentLikeByThreadId(threadId);

    const commentWithReply = getCommentsThread.map((comment) => {
      const likes = getCommentLikes.filter((like) => like.comment === comment.id);
      const replies = getCommentReplies
        .filter((reply) => reply.comment === comment.id)
        .map((reply) => new CommentReplyDetail(reply));

      return new CommentDetail({
        ...comment,
        likeCount: likes.length,
        replies,
      });
    });

    return new ThreadDetail({
      ...threadDetail,
      comments: commentWithReply,
    });
  }

  _validatePayload(threadId) {
    if (!threadId) {
      throw new Error('THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string') {
      throw new Error('THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadDetailUseCase;
