const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log('Server running on port ${PORT}');
    });
  })
  .catch(err => console.error(err));