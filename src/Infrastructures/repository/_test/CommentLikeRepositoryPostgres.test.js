const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const CommentLikesTableHelper = require('../../../../tests/CommentLikesTableTestHelper');

describe('CommentLikeRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addCommentLike function', () => {
    it('should persist new comment like and return added comment like correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      await ThreadsTableTestHelper.createThread({
        id: 'thread-h_123',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.postComment({
        id: 'comment-q_123',
        content: 'What a case, For Real?',
        thread: 'thread-h_123',
        owner: 'user-123',
      });

      const payload = {
        comment: 'comment-q_123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await commentLikeRepositoryPostgres.addCommentLike(payload.comment, payload.owner);

      const likedComment = await CommentLikesTableHelper.checkIsCommentLiked(
        payload.comment,
        payload.owner,
      );

      expect(likedComment).toHaveLength(1);
    });
  });

  describe('checkIsCommentLiked function', () => {
    it("should return empty array if user doesn't like this comment yet", async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      await ThreadsTableTestHelper.createThread({
        id: 'thread-h_123',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.postComment({
        id: 'comment-q_123',
        content: 'What a case, For Real?',
        thread: 'thread-h_123',
        owner: 'user-123',
      });

      const payload = {
        comment: 'comment-q_123',
        owner: 'user-123',
      };

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const likedComment = await commentLikeRepositoryPostgres.checkIsCommentLiked(
        payload.comment,
        payload.owner,
      );

      expect(likedComment).toHaveLength(0);
    });

    it('should return array if user like this comment', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      await ThreadsTableTestHelper.createThread({
        id: 'thread-h_123',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.postComment({
        id: 'comment-q_123',
        content: 'What a case, For Real?',
        thread: 'thread-h_123',
        owner: 'user-123',
      });

      const payload = {
        comment: 'comment-q_123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      await commentLikeRepositoryPostgres.addCommentLike(payload.comment, payload.owner);

      const likedComment = await commentLikeRepositoryPostgres.checkIsCommentLiked(
        payload.comment,
        payload.owner,
      );

      expect(likedComment).toHaveLength(1);
    });
  });

  describe('deleteCommentLike function', () => {
    it('should delete like from persisted store', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      await ThreadsTableTestHelper.createThread({
        id: 'thread-h_123',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.postComment({
        id: 'comment-q_123',
        content: 'What a case, For Real?',
        thread: 'thread-h_123',
        owner: 'user-123',
      });

      const payload = {
        comment: 'comment-q_123',
        owner: 'user-123',
      };

      await CommentLikesTableHelper.addCommentLike(payload.comment, payload.owner);

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      await commentLikeRepositoryPostgres.deleteCommentLike(payload.comment, payload.owner);

      const unlikedComment = await CommentLikesTableHelper.checkIsCommentLiked(
        payload.comment,
        payload.owner,
      );

      expect(unlikedComment).toHaveLength(0);
    });
  });

  describe('getCommentLikeByThreadId funtion', () => {
    it('should return like count same as count on database', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'codingdi' });

      await ThreadsTableTestHelper.createThread({
        id: 'thread-h_123',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.postComment({
        id: 'comment-q_123',
        content: 'What a case, For Real?',
        thread: 'thread-h_123',
        owner: 'user-123',
      });

      const threadId = 'thread-h_123';
      const comment = 'comment-q_123';
      const firstUser = 'user-123';
      const secondUser = 'user-456';

      await CommentLikesTableHelper.addCommentLike({ id: 'like-y_123', comment, owner: firstUser });

      await CommentLikesTableHelper.addCommentLike({
        id: 'like_y-456',
        comment,
        owner: secondUser,
      });

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const likeCount = await commentLikeRepositoryPostgres.getCommentLikeByThreadId(threadId);

      expect(likeCount).toHaveLength(2);
    });

    it('should return empty array when comment no have like', async () => {
      const threadId = 'thread-h_123';

      const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool, {});

      const likeCount = await commentLikeRepositoryPostgres.getCommentLikeByThreadId(threadId);

      expect(likeCount).toHaveLength(0);
    });
  });
});
