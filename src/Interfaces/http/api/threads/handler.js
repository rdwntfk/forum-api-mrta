const CreateThreadUseCase = require('../../../../Applications/use_case/threads/CreateThreadUseCase');
const ThreadDetailUseCase = require('../../../../Applications/use_case/threads/ThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.createThreadHandler = this.createThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async createThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const useCasePayload = { ...request.payload, owner };
    const createThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
    const createdThread = await createThreadUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread: createdThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const { threadId } = request.params;
    const threadDetailUseCase = this._container.getInstance(ThreadDetailUseCase.name);

    const thread = await threadDetailUseCase.execute(threadId);

    return h.response({
      status: 'success',
      data: {
        thread,
      },
    });
  }
}

module.exports = ThreadsHandler;
