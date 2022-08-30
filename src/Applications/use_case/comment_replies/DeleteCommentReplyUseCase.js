class DeleteCommentReplyUseCase {
  constructor({ threadRepository, commentRepository, commentReplyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const {
      commentReplyId, thread, comment, owner,
    } = useCasePayload;
    await this._threadRepository.verifyThreadIsAvailable(thread);
    await this._commentRepository.verifyCommentIsAvailable(comment);
    await this._commentReplyRepository.verifyCommentReplyIsAvailable(commentReplyId);
    await this._commentReplyRepository.verifyCommentReplyOwner(commentReplyId, owner);
    await this._commentReplyRepository.deleteCommentReply(commentReplyId);
  }

  _validatePayload(payload) {
    const {
      thread, comment, commentReplyId, owner,
    } = payload;

    if (!thread || !comment || !commentReplyId || !owner) {
      throw new Error('DELETE_COMMENT_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof commentReplyId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentReplyUseCase;
