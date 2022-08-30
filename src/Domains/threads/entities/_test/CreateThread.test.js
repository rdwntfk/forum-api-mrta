const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload didn`t contain needed property', () => {
    const payload = {
      title: 'Police has been murdered by his mate.',
    };

    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload didn`t meet data type specification', () => {
    const payload = {
      body: 911,
      title: 'Police has been murdered by his mate.',
      owner: 110,
    };

    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create CreateThread object Correctly', () => {
    const payload = {
      title: 'Police has been murdered by his mate.',
      body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
      owner: 'user-123',
    };

    const { title, body, owner } = new CreateThread(payload);

    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
  });
});
