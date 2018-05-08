require('envdotjs').load();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;
const connectToDatabase = () => {
  if (isConnected) {
    return Promise.resolve();
  }

  return mongoose.connect(process.env.DB_URI).then(db => {
    isConnected = db.connections[0].readyState;
  });
};
module.exports = { connectToDatabase };
