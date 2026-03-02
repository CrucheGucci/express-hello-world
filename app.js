const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const sqlite = require('node:sqlite');
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync('./storage/votes.sqlite');

const ifExist = database.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='votes'`);
if (ifExist.all().length == 0) {
database.exec(`
  CREATE TABLE votes(
  vote INTEGER,
  time INTEGER
   ) STRICT
  
  `)

}
const insert = database.prepare('INSERT INTO votes (vote, time) VALUES (?, ?)');
const getVotes = database.prepare('SELECT vote, time FROM votes');
const count = database.prepare('SELECT COUNT(vote) as count FROM votes WHERE vote = ?')


////// server
app.get('/all', (req, res) => {
  res.send(`Vote1 total votes: ${JSON.stringify(getVotes.all())}`)
})

app.get('/Vote1', (req, res) => {
  res.send(`Vote1 total votes: ${count.get(1).count}`)
})

app.get('/Vote2', (req, res) => {
  res.send(`Vote2 total votes: ${count.get(2).count}`)
})

app.get('/Vote3', (req, res) => {
  res.send(`Vote3 total votes: ${count.get(3).count}`)
})

// <<<<<<<<<<<<<<<<<<<<<<<<<<----------POST----------------------->>>>>>>>>>>>>>>>>>>>>>>>>>
app.post('/Vote1', (req, res) => {
  insert.run(1, Date.now())
  res.send(`Added vote at vote1. Total votes: ${count.get(1).count} `)
})

app.post('/Vote2', (req, res) => {
 insert.run(2, Date.now())
  res.send(`Added vote at vote2. Total votes: ${count.get(2).count}`)
})


app.post('/Vote3', (req, res) => {
  insert.run(3, Date.now())
  res.send(`Added vote at vote3. Total votes: ${count.get(3).count}`)
})




const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
