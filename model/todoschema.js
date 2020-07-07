var mongoose = require('mongoose');
// Create a schema
var TodoSchema = new mongoose.Schema({
    name: String,
    completed: Boolean,
    note: String,
    latitude: Number,
    longitude: Number,
    updated_at: { type: Date, default: Date.now },
  });

  // Create a model based on the schema
const todoMode = module.exports = mongoose.model('Todo', TodoSchema);