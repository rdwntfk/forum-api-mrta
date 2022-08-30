const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      id: 'thread-h_123',
      title: 'Police has been murdered by his mate.',
    };

    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload didn`t meet data type specification', () => {
    const payload = {
      id: 911,
      title: 'Police has been murdered by his mate.',
      owner: 110,
    };

    expect(() => new CreatedThread(payload)).toThrowError(
      'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreatedThread object correctly', () => {
    const payload = {
      id: 'thread-h_123',
      title: 'Police has been murdered by his mate.',
      owner: 'user-123',
    };

    const { id, title, owner } = new CreatedThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
