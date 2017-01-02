import mongoose from 'mongoose';
import serverConfig from './config';
import Prod from './models/prod';

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

console.log(serverConfig);
Prod.find().exec((err, prods) => console.log(prods));
