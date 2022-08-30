const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createThread function', () => {
    it('should persist create thread and found created thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const newThread = new CreateThread({
        title: 'Police has been murdered by his mate.',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.createThread(newThread);
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-h_123');

      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      const newThread = new CreateThread({
        title: 'Police has been murdered by his mate.',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const createdThread = await threadRepositoryPostgres.createThread(newThread);

      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: 'thread-h_123',
          title: 'Police has been murdered by his mate.',
          owner: 'user-123',
        }),
      );
    });

    describe('verifyThreadIsAvailable function', () => {
      it('should not throw NotFoundError when id exist', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.createThread({ id: 'thread-h_123' });

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await expect(
          threadRepositoryPostgres.verifyThreadIsAvailable('thread-h_123'),
        ).resolves.not.toThrowError(NotFoundError);
      });

      it('should throw NotFoundError when id not exist', async () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

        await expect(
          threadRepositoryPostgres.verifyThreadIsAvailable('thread-h_123'),
        ).rejects.toThrowError(NotFoundError);
      });
    });
  });

  describe('getThreadDetail function', () => {
    it('should persist get detail thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.createThread({ id: 'thread-h_123', owner: 'user-123' });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const thread = await threadRepositoryPostgres.getThreadDetail('thread-h_123');

      expect(thread.id).toEqual('thread-h_123');
      expect(thread.username).toEqual('dicoding');
    });
  });
});
