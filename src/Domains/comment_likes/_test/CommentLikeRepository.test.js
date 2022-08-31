const CommentLikeRepository = require('../CommentLikeRepository');

describe('CommentLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentLikeRepository = new CommentLikeRepository();

    await expect(commentLikeRepository.checkIsCommentLiked('')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentLikeRepository.addCommentLike('')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentLikeRepository.deleteCommentLike('')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(commentLikeRepository.getCommentLikeByThreadId('')).rejects.toThrowError(
      'COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
