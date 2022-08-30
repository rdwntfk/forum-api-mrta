const PostComment = require('../../../Domains/comments/entities/PostComment');

class PostCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    await this._threadRepository.verifyThreadIsAvailable(thread);
    const newComment = new PostComment(useCasePayload);
    return this._commentRepository.postComment(newComment);
  }
}

module.exports = PostCommentUseCase;
