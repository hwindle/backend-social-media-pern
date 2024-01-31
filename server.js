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
}).catch(error => console.error(`DB connect error: ${error}`));;

// home message
const homeHandler = (req, res) => {
  res.status(200).send('GET /topfollowers, /overview, POST /topfollowers, /overview - wrong URL');
};

// add 1 top followers record
const addTopFollower = (req, res) => {
  // validate these items
  const type = req.body.type;
  const handle = req.body.handle;
  const followers = parseInt(req.body.followers) || 0;
  const trend = parseInt(req.body.trend) || 0;
  let INSERT = 'INSERT INTO topfollowers (type, handle, followers, trend) VALUES ($1, $2, $3, $4)';
  let safeValues = [type, handle, followers, trend];
  dbClient.query(INSERT, safeValues).then(dbResult => {
    console.log(`Inserted ${dbResult.rowCount} records. :-D`);
  }).catch(error => console.error(`Insert error: ${error}`));
  // return all data
  dbClient.query('SELECT * FROM topfollowers').then(results => {
    return res.status(200).send(results.rows);
  });
};

// return all top followers data 
const fetchAlltopFollowers = (req, res) => {
  const SQL = 'SELECT * FROM topfollowers ORDER BY id';
  dbClient
    .query(SQL)
    .then((results) => {
      return res.status(200).send(results.rows);
    })
    .catch((error) => console.error('Select error: ', error));
};

// delete records by id
const deleteTopFollowerById = (req, res) => {
  const id = parseInt(req.body.id);
  const SQL = 'DELETE FROM topfollowers WHERE id = $1';
  let values = [id];
  dbClient.query(SQL, values).then(result => {
    console.log(`Delete result: ${result.rowCount}`);
  }).catch(error => console.error(`Delete err: ${error}`));
  // return all data
  dbClient.query('SELECT * FROM topfollowers').then(results => {
    return res.status(200).send(results.rows);
  });
};

// add 1 overview record
const addOverview = (req, res) => {
  // validate these items
  const type = req.body.type;
  const title = req.body.title;
  const number = parseInt(req.body.followers);
  const percentage = parseInt(req.body.percentage);
  let INSERT = 'INSERT INTO overview (type, title, number, percentage) VALUES ($1, $2, $3, $4)';
  let safeValues = [type, title, number, percentage];
  dbClient.query(INSERT, safeValues).then(dbResult => {
    console.log(`Inserted ${dbResult.rowCount} records into overview table.`);
  }).catch(error => console.error(`Insert error: ${error}`));
  // return all data
  dbClient.query('SELECT * FROM overview').then(results => {
    return res.status(200).send(results.rows);
  });
};

// return all overview data 
const fetchAllOverview = (req, res) => {
  const SQL = 'SELECT * FROM overview ORDER BY id';
  dbClient
    .query(SQL)
    .then((results) => {
      return res.status(200).send(results.rows);
    })
    .catch((error) => console.error('Select error: ', error));
};

// delete records by id
const deleteOverviewById = (req, res) => {
  const id = parseInt(req.body.id);
  const SQL = 'DELETE FROM overview WHERE id = $1';
  let values = [id];
  dbClient.query(SQL, values).then(result => {
    console.log(`Delete result: ${result.rowCount}`);
  }).catch(error => console.error(`Delete err: ${error}`));
  // return all data
  dbClient.query('SELECT * FROM overview').then(results => {
    return res.status(200).send(results.rows);
  });
};

/***
 * ENDPOINTS
 *
 * For top folowers table, and overview table
 */
// Home page
app.get('/', homeHandler);
// add a top follower
app.post('/topfollowers', addTopFollower);
// get all top followers info
app.get('/topfollowers', fetchAlltopFollowers);
// delete one top follower by id
app.delete('/topfollowers', deleteTopFollowerById);

// add an overview row
app.post('/overview', addOverview);
// get all overview rows
app.get('/overview', fetchAllOverview);
// delete one top follower by id
app.delete('/overview', deleteOverviewById);