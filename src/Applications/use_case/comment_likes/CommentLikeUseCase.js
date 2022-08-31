class CommentLikeUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);
    await this._threadRepository.verifyThreadIsAvailable(payload.threadId);
    await this._commentRepository.verifyCommentIsAvailable(payload.commentId);
    const likedComment = await this._commentLikeRepository.checkIsCommentLiked(payload);

    if (likedComment.length === 0) {
      await this._commentLikeRepository.addCommentLike(payload);
    } else {
      await this._commentLikeRepository.deleteCommentLike(payload);
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
