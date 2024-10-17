const express = require('express');
const mongoose = require('mongoose');
const countyRoutes = require('./routes/countyRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const mongoURI = 'mongodb://localhost:27017/demographicData';

mongoose.connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.static(path.join(__dirname, '../public'))); 
app.use(express.json());
app.use('/api/counties', countyRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); 
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
