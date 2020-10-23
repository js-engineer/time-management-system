const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');

dotenv.config();

const apiRoutes = require('./routes/apiRoutes');

// MongoDB config
require('./loaders/db');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(logger('dev'));

app.use('/api', apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
