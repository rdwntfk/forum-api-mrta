const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const PostCommentReply = require('../../../Domains/comment_replies/entities/PostCommentReply');
const PostedCommentReply = require('../../../Domains/comment_replies/entities/PostedCommentReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('postCommentReply function', () => {
    it('should persist new comment reply and return posted comment reply correctly', async () => {
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

      const newCommentReply = new PostCommentReply({
        content: 'Sure, i knew all this case from news.',
        thread: 'thread-h_123',
        comment: 'comment-q_123',
        owner: 'user-456',
      });

      const fakeIdGenerator = () => '123';
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const postedCommentReply = await commentReplyRepositoryPostgres.postCommentReply(
        newCommentReply,
      );

      const commentReply = await CommentRepliesTableTestHelper.findCommentRepliesById('reply-123');
      expect(postedCommentReply).toStrictEqual(
        new PostedCommentReply({
          id: 'reply-123',
          content: 'Sure, i knew all this case from news.',
          owner: 'user-456',
        }),
      );
      expect(commentReply).toHaveLength(1);
    });
  });

  describe('verifyCommentReplyIsAvailable function', () => {
    it('should throw NotFoundError if comment reply not available', async () => {
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      await expect(
        commentReplyRepositoryPostgres.verifyCommentReplyIsAvailable('thereisnothing123'),
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError if comment reply available', async () => {
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});
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
      await CommentRepliesTableTestHelper.postCommentReply({
        id: 'reply-123',
        content: 'Sure, i knew all this case from news.',
        thread: 'thread-h_123',
        comment: 'comment-q_123',
        owner: 'user-123',
      });

      await expect(
        commentReplyRepositoryPostgres.verifyCommentReplyIsAvailable('reply-123'),
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentReplyOwner function', () => {
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
      await CommentRepliesTableTestHelper.postCommentReply({
        id: 'reply-123',
        content: 'Sure, i knew all this case from news.',
        thread: 'thread-h_123',
        comment: 'comment-q_123',
        owner: 'user-123',
      });

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      await expect(
        commentReplyRepositoryPostgres.verifyCommentReplyOwner('reply-123', 'user-456'),
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError if comment reply is belongs to owner', async () => {
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});
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
      await CommentRepliesTableTestHelper.postCommentReply({
        id: 'reply-123',
        content: 'Sure, i knew all this case from news.',
        thread: 'thread-h_123',
        comment: 'comment-q_123',
        owner: 'user-123',
      });

      await expect(
        commentReplyRepositoryPostgres.verifyCommentReplyOwner('reply-123', 'user-123'),
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentReply', () => {
    it('should delete the comment reply from database', async () => {
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
      await CommentRepliesTableTestHelper.postCommentReply({
        id: 'reply-123',
        content: 'Sure, i knew all this case from news.',
        thread: 'thread-h_123',
        comment: 'comment-q_123',
        owner: 'user-123',
      });

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});
      await commentReplyRepositoryPostgres.deleteCommentReply('reply-123');

      const commentReply = await CommentRepliesTableTestHelper.verifyIsDeletedCommentReplyById(
        'reply-123',
      );
      expect(commentReply).toEqual(true);
    });
  });

  describe('getCommentReplies', () => {
    it('should get replies of comment', async () => {
      const adminPayload = { id: 'admin-001', username: 'indonesia' };
      const firstUserPayload = { id: 'user-123', username: 'dicoding' };
      const secondUserPayload = { id: 'user-456', username: 'codingdi' };
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
        owner: firstUserPayload.id,
      };
      const commentReplyPayload = {
        id: 'reply-123',
        content: 'Sure, i knew all this case from news.',
        thread: threadPayload.id,
        comment: commentPayload.id,
        owner: secondUserPayload.id,
      };

      await UsersTableTestHelper.addUser(adminPayload);
      await UsersTableTestHelper.addUser(firstUserPayload);
      await UsersTableTestHelper.addUser(secondUserPayload);
      await ThreadsTableTestHelper.createThread(threadPayload);
      await CommentsTableTestHelper.postComment(commentPayload);
      await CommentRepliesTableTestHelper.postCommentReply(commentReplyPayload);

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});
      const commentReplies = await commentReplyRepositoryPostgres.getCommentReplies(
        threadPayload.id,
      );

      expect(Array.isArray(commentReplies)).toBe(true);
      expect(commentReplies[0].id).toEqual(commentReplyPayload.id);
      expect(commentReplies[0].username).toEqual(secondUserPayload.username);
      expect(commentReplies[0].content).toEqual(commentReplyPayload.content);
      expect(commentReplies[0].date).toBeDefined();
    });
  });
});
