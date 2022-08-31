const CommentLikeUseCase = require('../../../../Applications/use_case/comment_likes/CommentLikeUseCase');

class CommentLikeHandler {
  constructor(container) {
    this._container = container;

    this.commentLikeHandler = this.commentLikeHandler.bind(this);
  }

  async commentLikeHandler(request) {
    const commentLikeUseCase = this._container.getInstance(CommentLikeUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const payload = {
      threadId,
      commentId,
      owner,
    };

    await commentLikeUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentLikeHandler;
