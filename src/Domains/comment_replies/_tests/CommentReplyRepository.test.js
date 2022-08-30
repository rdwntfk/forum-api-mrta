const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository Interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentReplyRepository = new CommentReplyRepository();

    await expect(commentReplyRepository.postCommentReply({})).rejects.toThrowError(
      'COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentReplyRepository.verifyCommentReplyIsAvailable({})).rejects.toThrowError(
      'COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentReplyRepository.verifyCommentReplyOwner({})).rejects.toThrowError(
      'COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentReplyRepository.deleteCommentReply({})).rejects.toThrowError(
      'COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentReplyRepository.getCommentReplies('')).rejects.toThrowError(
      'COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
