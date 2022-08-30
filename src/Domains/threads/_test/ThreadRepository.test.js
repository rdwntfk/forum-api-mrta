const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.createThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(threadRepository.verifyThreadIsAvailable('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
    await expect(threadRepository.getThreadDetail('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });
});
