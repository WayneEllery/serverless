const mongoose = require('mongoose');

const postsSchema = mongoose.Schema({
  title: String,
  body: String
});

postsSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

postsSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;