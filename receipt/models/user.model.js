const { model, pluralize, Schema } = require('mongoose');

pluralize(null);

const userSchema = new Schema({
  name: String,
  login: String,
  password: String,
  likes: [],
});

module.exports = model('User', userSchema);
