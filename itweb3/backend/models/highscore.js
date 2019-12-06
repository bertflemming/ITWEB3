'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HighScoreSchema = new Schema({
  score: {
      type: Number,
      required: true
  },
  n: {
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  },
});

// Inject to mongoose models
mongoose.model('HighScore', HighScoreSchema);