const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'server/.env'});

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB_CONNECT_URI || 'mongodb://127.0.0.1:27017/dietPlanner', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err.message);
  }
);

module.exports = mongoose.connection;