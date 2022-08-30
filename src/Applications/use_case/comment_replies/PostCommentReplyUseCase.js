const PostCommentReply = require('../../../Domains/comment_replies/entities/PostCommentReply');

class PostCommentReplyUseCase {
  constructor({ commentReplyRepository, threadRepository, commentRepository }) {
    this._commentReplyRepository = commentReplyRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread, comment } = useCasePayload;
    await this._threadRepository.verifyThreadIsAvailable(thread);
    await this._commentRepository.verifyCommentIsAvailable(comment);
    const newCommentReply = new PostCommentReply(useCasePayload);
    return this._commentReplyRepository.postCommentReply(newCommentReply);
  }
}

module.exports = PostCommentReplyUseCase;
