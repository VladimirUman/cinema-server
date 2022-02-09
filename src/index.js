const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const appRouter = require('./routes/index');
const { config } = require('./config/index');
const { logger } = require('./utils/logger');

const app = express();
const port = config.port || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(config.database, { useNewUrlParser: true }).catch((e) => {
    console.error('Connection error', e.message);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', logger, appRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
