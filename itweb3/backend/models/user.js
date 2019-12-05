'use strict';

// Module dependencies

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, unique: true, required: true, default: '' },
    hashedPassword: { type: String, required: true, default: '' }
});

// Inject to mongoose models
mongoose.model('User', UserSchema);