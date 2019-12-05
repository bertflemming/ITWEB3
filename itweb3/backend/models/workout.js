'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  title: {
      type: String,
      required: true,
  },
  user: {type: Schema.ObjectId, ref: 'User'},
  exercises: [{
      name: {
          type: String,
          required: true
      },
      description: {
        type: String,
        required: true
      },
      set: {
          type: Number,
          required: true
      },
      reps_time: {
          type: Number,
          required: true
      }
  }]
});

// Inject to mongoose models
mongoose.model('Workout', WorkoutSchema);