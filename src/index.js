const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const appRouter = require('./routes/index');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }).catch((e) => {
    console.error('Connection error', e.message);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', appRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));