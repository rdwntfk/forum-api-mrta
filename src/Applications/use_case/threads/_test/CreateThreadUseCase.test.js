const CreateThread = require('../../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const CreateThreadUseCase = require('../CreateThreadUseCase');

describe('CreateThreadUseCase', () => {
  it('it should orchestrating the create thread action correctly', async () => {
    const useCasePayload = {
      title: 'Police has been murdered by his mate.',
      body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
      owner: 'user-123',
    };
    const expectedCreatedThread = new CreatedThread({
      id: 'thread-h_123',
      title: 'Police has been murdered by his mate.',
      owner: 'user-123',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.createThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedThread));

    const createThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const createdThread = await createThreadUseCase.execute(useCasePayload);
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.createThread).toBeCalledWith(
      new CreateThread({
        title: 'Police has been murdered by his mate.',
        body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
        owner: 'user-123',
      }),
    );
  });
});
