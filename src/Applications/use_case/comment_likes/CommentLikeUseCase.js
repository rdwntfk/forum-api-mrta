class CommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);
    const { threadId, commentId, owner } = payload;
    await this._threadRepository.verifyThreadIsAvailable(threadId);
    await this._commentRepository.verifyCommentIsAvailable(commentId);
    const likedComment = await this._commentLikeRepository.checkIsCommentLiked(commentId, owner);

    if (likedComment.length === 0) {
      await this._commentLikeRepository.addCommentLike(commentId, owner);
    } else {
      await this._commentLikeRepository.deleteCommentLike(commentId, owner);
    }
  }

  _validatePayload(payload) {
    const { owner, threadId, commentId } = payload;
    if (!owner || !threadId || !commentId) {
      throw new Error('COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof owner !== 'string'
      || typeof threadId !== 'string'
      || typeof commentId !== 'string'
    ) {
      throw new Error('COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLikeUseCase;
