'use strict';

const express = require('express');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
// fetch post req.body fields as JSON
app.use(express.json());

const dbClient = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_URL,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const PORT = process.env.PORT || 3003;
// only start the server if we can connect to the DB
dbClient.connect().then(() => {
  app.listen(PORT, () => {
    console.log('Express, Postgresql API listening port: ', PORT);
  });
});