const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const userSchema = new Schema({
  authID: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  image: {
    type: String,
  }
});

// Create collection and add Schema
mongoose.model('users', userSchema);