const PostCommentReplyUseCase = require('../../../../Applications/use_case/comment_replies/PostCommentReplyUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/comment_replies/DeleteCommentReplyUseCase');

class CommentReplyHandler {
  constructor(container) {
    this._container = container;
    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler(request, h) {
    const postCommentReplyUseCase = this._container.getInstance(PostCommentReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId: thread, commentId: comment } = request.params;
    const useCasePayload = {
      content: request.payload.content,
      thread,
      comment,
      owner,
    };
    const postedCommentReply = await postCommentReplyUseCase.execute(useCasePayload);

    return h
      .response({
        status: 'success',
        data: {
          addedReply: postedCommentReply,
        },
      })
      .code(201);
  }

  async deleteCommentReplyHandler(request, h) {
    const deleteCommentReplyUseCase = this._container.getInstance(DeleteCommentReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const { threadId: thread, commentId: comment, replyId: commentReplyId } = request.params;
    const useCasePayload = {
      thread,
      comment,
      commentReplyId,
      owner,
    };
    await deleteCommentReplyUseCase.execute(useCasePayload);

    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentReplyHandler;
