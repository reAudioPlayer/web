const express = require('express');
const app = express();
const server = require('http').createServer(app);
const db = require('./models/index.js');
app.use(express.urlencoded({ extended: true }))

console.log(process.env.DATABASE_URL);

var io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Webserver running on Port %d', port);
});


app.use(express.static(__dirname + '/public'));

function findUserByKey(socket, key)
{
  db.GameLib.findAll({where: { key: key.toUpperCase() }, limit: 1})
  .then(entries => {
    console.log(entries.length + " entries")
    if(entries.length > 0)
    {
      socket.emit('game library of', JSON.parse(entries[0].dataValues.lib));
    }
    else
    {
      socket.emit('game library of', "null");
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
  db.GameLib.findAll({where: { key: key.toUpperCase() }, limit: 1})
  .then(entries => {
    if (entries.length > 0)
    {
      db.GameLib.update({lib: lib}, {where: {key: key}});
    }
    else
    {
      writeKeyLib(key, lib);
    }
  });
}

function synchroniseGameDatabase(socket, dbProposed)
{
  db.GameLib.findAll({where: { key: "MASTER" }, limit: 1})
  .then(entries => {
    console.log(entries.length + " entries")
    if(entries.length > 0)
    {
      const mstr = JSON.parse(entries[0].dataValues.lib);

      const filtered = Object.values({...mstr, ...dbProposed});
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
    //const json = JSON.parse(msg);
    const json = msg;
    authoriseUser(json);

    socket.username = json.key;
    addedUser = true;

    socket.emit('authorised');
    console.log(socket.username + ": authorised");

    // notify others
    socket.broadcast.emit('msc/authorised', socket.username);
  });

  socket.on('get game library of', function(key) {
    socket.broadcast.emit('msg/get game library of', {
      username: socket.username, key: key
    });
    findUserByKey(socket, key)
  });

  socket.on('synchronise game database', function(db) {
    socket.broadcast.emit('msg/synchronise game database', socket.username);
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

  socket.on('launch game', function (game) {
    const msg = {
      inviter: socket.username,
      receiver: game.receiver,
      gameId: game.id
    };
    socket.broadcast.emit('game invite', msg);
  });

  socket.on('disconnect', function () {
    if (addedUser) {
      socket.broadcast.emit('msg/disconnect', socket.username);
    }
  });
});