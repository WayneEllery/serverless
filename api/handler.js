'use strict';
const mongoose = require('mongoose');
const to = require('await-to-js').default;
const PostModel = require('./model/Post');
let db;

function handleError(err, callback) {
  console.error(err);

  const response = {
    statusCode: 501,
    body: 'An error has occurred',
  };

  callback(null, response);
}

const connectToDb = async () => mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);

module.exports.posts = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!db) {
    const [ connErr ] = await to(connectToDb());

    if (connErr) {
      handleError(connErr, callback);
      return;
    }

    db = mongoose.connection;
  }

  const [ err, posts ] = await to(PostModel.find());

  if (err) {
    handleError(err, callback);
    return;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(posts),
  };

  callback(null, response);
};

module.exports.postsCreate = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!db) {
    const [ connErr ] = await to(connectToDb());

    if (connErr) {
      handleError(connErr, callback);
      return;
    }

    db = mongoose.connection;
  }

  const post = new PostModel(JSON.parse(event.body));
  const [ err ] = await to(post.save());

  if (err) {
    handleError(callback);
    return;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(post),
  };

  callback(null, response);
};
