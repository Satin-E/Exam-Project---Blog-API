const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
dotenv.config();
const app = express();


app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.get('/', (req, res) => res.send('Welcome to the Blog API!'));

module.exports = app;