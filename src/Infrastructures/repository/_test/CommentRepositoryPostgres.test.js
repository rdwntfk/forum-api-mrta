const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postComment function', () => {
    it('should persist new comment and return posted comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.createThread({
        id: 'thread-h_123',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });

      const newComment = new PostComment({
        content: 'What a case, For Real?',
        thread: 'thread-h_123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const postedComment = await commentRepositoryPostgres.postComment(newComment);

      const comment = await CommentsTableTestHelper.findCommentsById('comment-q_123');
      expect(postedComment).toStrictEqual(
        new PostedComment({
          id: 'comment-q_123',
          content: 'What a case, For Real?',
          owner: 'user-123',
        }),
      );
      expect(comment).toHaveLength(1);
    });
  });

  describe('verifyCommentIsAvailable function', () => {
    it('should throw NotFoundError if comment not available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentIsAvailable('thereisnothing123'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment available', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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

      await expect(
        commentRepositoryPostgres.verifyCommentIsAvailable('comment-q_123'),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError if comment not belong to owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding1' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding2' });
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-q_123', 'user-456'),
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if comment is belongs to owner', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
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

      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-q_123', 'user-123'),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment', () => {
    it('should delete the comment from database', async () => {
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment('comment-q_123');

      const comment = await CommentsTableTestHelper.verifyIsDeletedCommentById('comment-q_123');
      expect(comment).toEqual(true);
    });
  });

  describe('getCommentsThread', () => {
    it('should get comments of thread', async () => {
      const adminPayload = { id: 'admin-001', username: 'indonesia' };
      const userPayload = { id: 'user-123', username: 'dicoding' };
      const threadPayload = {
        id: 'thread-h_123',
        title: 'Police has been murdered by his mate.',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: adminPayload.id,
      };
      const commentPayload = {
        id: 'comment-q_123',
        content: 'What a case, For Real?',
        thread: threadPayload.id,
        owner: userPayload.id,
      };

      await UsersTableTestHelper.addUser(adminPayload);
      await UsersTableTestHelper.addUser(userPayload);
      await ThreadsTableTestHelper.createThread(threadPayload);
      await CommentsTableTestHelper.postComment(commentPayload);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const comments = await commentRepositoryPostgres.getCommentsThread(threadPayload.id);

      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0].id).toEqual(commentPayload.id);
      expect(comments[0].username).toEqual(userPayload.username);
      expect(comments[0].content).toEqual(commentPayload.content);
      expect(comments[0].date).toBeDefined();
    });
  });
});
