'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  date: {
      type: String,
      required: true,
  },
  comment: {
      type: String,
      required: true
  },
  user: {type: Schema.ObjectId, ref: 'User'},
  workout: { type: Schema.ObjectId, ref: 'Workout'},
  workout_title: {
      type: String,
  }
});

// Inject to mongoose models
mongoose.model('Activity', ActivitySchema);