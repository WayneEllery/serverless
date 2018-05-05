'use strict';
const mongoose = require('mongoose');
const to = require('await-to-js').default;
const PostModel = require('./model/Post');

function handleError(err, callback) {
  const response = {
    statusCode: 501,
    body: 'An error has occurred',
  };

  callback(null, response);
}

function connectToDb() {
  mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
  return mongoose.connection;
}

module.exports.posts = (event, context, callback) => {
  const db = connectToDb();

  db.once('open', async () => {
    const [ err, posts ] = await to(PostModel.find());
    db.close();

    if (err) {
      handleError(err, callback);
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(posts),
    };

    callback(null, response);
  });
};

module.exports.postsCreate = (event, context, callback) => {
  const db = connectToDb();

  db.once('open', async () => {
    const post = new PostModel(JSON.parse(event.body));
    console.log(event.body);
    const [ err ] = await to(post.save());
    db.close();

    if (err) {
      handleError(callback);
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(post),
    };

    callback(null, response);
  });
};
