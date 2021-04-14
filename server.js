const express = require('express');
const app = express();
const server = require('http').createServer(app);
const db = require('./models/index.js');
app.use(express.urlencoded({ extended: true }))

var io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

var port = process.env.PORT || 3000;
/*app.use(require('express-basic-auth')({
  users: { 'admin': 'password' }, // vergib hier deine gewünschten Benutzernamen und Passwörter
  challenge: true
}));*/
server.listen(port, function () {
  console.log('Webserver running on Port %d', port);
});


app.use(express.static(__dirname + '/public'));

function findUserByKey(socket, key)
{
  /*if (key.length != 6)
  {
    return;
  }*/

  console.log(key);
  db.GameLib.findAll({where: { key: key.toUpperCase() }, limit: 1})
  .then(entries => {
    console.log(entries.length + " entries")
    if(entries.length > 0)
    {
      socket.emit('game library of', entries[0].dataValues.lib);
    }
  });
}

function authoriseUser(json)
{
  updateKeyLib(json.key, json.value);
}

function writeKeyLib(key, lib)
{
  db.GameLib.findOrCreate({where: {key: key}, defaults: {lib: lib}});
}

function updateKeyLib(key, lib)
{
  db.GameLib.update({lib: lib}, {where: {key: key}});
}

function synchroniseGameDatabase(socket, dbProposed)
{
  db.GameLib.findAll({where: { key: "MASTER" }, limit: 1})
  .then(entries => {
    console.log(entries.length + " entries")
    if(entries.length > 0)
    {
      const mstr = JSON.parse(entries[0].dataValues.lib);

      const filtered = Object.values({...mstr, ...JSON.parse(dbProposed)});
      //var merged = mstr.concat(JSON.parse(dbProposed));
      //var filtered = merged.filter((item, pos) => merged.indexOf(item) === pos);

      updateKeyLib("MASTER", JSON.stringify(filtered));

      socket.emit('synchronised game database', filtered);
    }
  });
}

/* socket part */
io.on('connection', function (socket) {
  var addedUser = false; // has logged in

  // on attempted login
  socket.on('authorise', function (msg) {
    const json = JSON.parse(msg);
    authoriseUser(json);

    socket.username = json.key;
    addedUser = true;

    socket.emit('authorised');
    console.log(socket.username + ": authorised");

    // notify others
    socket.broadcast.emit('user authorised', socket.username);
  });

  socket.on('get game library of', function(key) {
    socket.broadcast.emit('new message', key);
    findUserByKey(socket, key)
  });

  socket.on('synchronise game database', function(db) {
    socket.broadcast.emit('new message', db);
    synchroniseGameDatabase(socket, db)
  });

  socket.on('verify root', function (password) {
    if (password != "pAsSwOrD")
    {
      socket.emit('declined');
      return;
    }
    socket.username = "root";
    addedUser = true;
    socket.emit('accepted');
  });

  socket.on('launch game', function (gameId) {
    // Sende die Nachricht an alle Clients
    console.log(socket.username + ": " + gameId)
    socket.broadcast.emit('game invite', {
      inviter: socket.username,
      gameId: gameId
    });
  });

  socket.on('disconnect', function () {
    if (addedUser) {
      socket.broadcast.emit('user left', socket.username);
    }
  });
});