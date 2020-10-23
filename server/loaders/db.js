const mongoose = require('mongoose');
const chalk = require('chalk');

const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log(
    connected('Mongoose default connection is open to', process.env.MONGODB)
  );
});

mongoose.connection.on('error', (err) => {
  console.log(error(`Mongoose default connection has occured ${err} error`));
});

mongoose.connection.on('disconnected', () => {
  console.log(disconnected('Mongoose default connection is disconnected'));
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(
      termination(
        'Mongoose default connection is disconnected due to application termination'
      )
    );
    process.exit(0);
  });
});
