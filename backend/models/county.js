const mongoose = require('mongoose');

const countySchema = new mongoose.Schema({
    population: { type: Number, required: true },
    state_name: { type: String, required: true }
});

const County = mongoose.model('County', countySchema);
module.exports = County;