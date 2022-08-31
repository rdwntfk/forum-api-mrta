const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/likes', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await CommentLikesTableTestHelper.cleanTable();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should add comment like and returning a success status', async () => {
      const credentialPayload = {
        username: 'dicoding',
        password: 'supersecretpassword',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'supersecretpassword',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: credentialPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Police has been murdered by his mate.',
          body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'What a case, For Real?',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const commentResponse = JSON.parse(comment.payload);

      const response = await server.inject({
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/likes`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should delete comment like and returning a success status', async () => {
      const credentialPayload = {
        username: 'dicoding',
        password: 'supersecretpassword',
      };

      const server = await createServer(container);

      const user = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'supersecretpassword',
          fullname: 'Dicoding Indonesia',
        },
      });

      const responseUser = JSON.parse(user.payload);

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: credentialPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Police has been murdered by his mate.',
          body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'What a case, For Real?',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const commentResponse = JSON.parse(comment.payload);

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-y_123',
        comment: commentResponse.data.addedComment.id,
        owner: responseUser.data.addedUser.id,
      });

      const response = await server.inject({
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/likes`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should throw error when not passing access token', async () => {
      const credentialPayload = {
        username: 'dicoding',
        password: 'supersecretpassword',
      };

      const server = await createServer(container);

      const user = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'supersecretpassword',
          fullname: 'Dicoding Indonesia',
        },
      });

      const responseUser = JSON.parse(user.payload);

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: credentialPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Police has been murdered by his mate.',
          body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'What a case, For Real?',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const commentResponse = JSON.parse(comment.payload);

      await CommentLikesTableTestHelper.addCommentLike({
        id: 'like-y_123',
        comment: commentResponse.data.addedComment.id,
        owner: responseUser.data.addedUser.id,
      });

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/likes`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should throw not found error when thread not exist', async () => {
      const credentialPayload = {
        username: 'dicoding',
        password: 'supersecretpassword',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'supersecretpassword',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: credentialPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const response = await server.inject({
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
        url: '/threads/anyThreadId/comments/anyCommentId/likes',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread not found in database');
    });

    it('should throw not found error when comment not exist', async () => {
      const credentialPayload = {
        username: 'dicoding',
        password: 'supersecretpassword',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'supersecretpassword',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: credentialPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'Police has been murdered by his mate.',
          body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: {
          content: 'What a case, For Real?',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const commentResponse = JSON.parse(comment.payload);

      const response = await server.inject({
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
        url: `/threads/${threadResponse.data.addedThread.id}/comments/anyCommentId/likes`,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment not found in database');
    });
  });
});
