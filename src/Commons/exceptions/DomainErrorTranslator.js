const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'cannot create a new user because the username character exceeds the limit',
  ),
  'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'registered user failed because doesn`t contain needed property',
  ),
  'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'registered user failed because data type doesn`t match with specification',
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('should send username and password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username and password should be string',
  ),
  'NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'should send access and refresh token',
  ),
  'NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'access token and refresh token should be string',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'should send refresh token',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token should be string',
  ),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError(
    'should send refresh token',
  ),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'refresh token should be string',
  ),
  'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'can`t create a new thread because the required property doesn`t exist',
  ),
  'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'can`t create a new thread because the data type doesn`t match',
  ),
  'CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'can`t create a new thread because the required property doesn`t exist',
  ),
  'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'can`t create a new thread because the data type doesn`t match',
  ),
  'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'can`t show thread detail because the required property doesn`t exist',
  ),
  'THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'can`t show thread detail because the data type doesn`t match',
  ),
  'THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'can`t show thread detail because the required property like threadId doesn`t exist',
  ),
  'THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'can`t show thread detail because the data type threadId must be string',
  ),
  'POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'can`t create a new comment because the required property doesn`t exist',
  ),
  'POST_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'can`t create a new comment because the data type doesn`t match',
  ),
  'POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'The comment hasn`t been posted yet because the required property doesn`t exist',
  ),
  'POSTED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'the comment hasn`t been posted yet because the data type doesn`t match',
  ),
  'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'The comment detail cant be shown because the required property doesn`t exist',
  ),
  'COMMENT_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'the comment detail cant be shown because the data type doesn`t match',
  ),
  'POST_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'can`t create a new comment reply because the required property doesn`t exist',
  ),
  'POST_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'can`t create a new comment reply because the data type doesn`t match',
  ),
  'POSTED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'The comment reply hasn`t been posted yet because the required property doesn`t exist',
  ),
  'POSTED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'the comment reply hasn`t been posted yet because the data type doesn`t match',
  ),
  'COMMENT_REPLY_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'The comment reply detail cant be shown because the required property doesn`t exist',
  ),
  'COMMENT_REPLY_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'the comment reply detail cant be shown because the data type doesn`t match',
  ),
  'COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'can`t liked this comment because the required property doesn`t exist',
  ),
  'COMMENT_LIKE_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'can`t liked this comment because the data type doesn`t match',
  ),
};

module.exports = DomainErrorTranslator;
