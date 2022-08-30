const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entitiy', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 0.123,
      title: true,
      body: 999,
      date: 'someId',
      username: {},
      comments: 123123123,
    };

    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should return ThreadDetail object correctly', () => {
    const payload = {
      id: 'thread-h_123',
      title: 'Police has been murdered by his mate.',
      body: 'This case was viral in Indonesian for long time since Q3 2022. The murder was found on Automation Program Developed By Dicoding',
      date: new Date('2022-08-22T07:19:09.775Z'),
      username: 'dicoding',
      comments: [],
    };

    const threadDetail = new ThreadDetail(payload);

    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date.toISOString());
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toStrictEqual(payload.comments);
  });
});
