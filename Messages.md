# Messages

### authorise
client -> server
```
{
    key: string; // userkey
    value: string; // game library as stringified json object
}
```
expects 'authorised'

### authorised
server -> client
```
null
```

### get game library of
client -> server
```
string; // userkey
```
expects 'game library of'

### game library of
server -> client
```
string; // game library as stringified json object
```

### launch game
client -> server
```
int; // igdbId
```
triggers 'game invite'

### game invite
server -> clients
```
{
    inviter: string; // userkey
    gameId: int; // igdbId
}
```

### synchronise game database
client -> server
```
obj; // game library
```
expects 'synchronised game database'

### synchronised game database
server -> client
```
obj; // game library
```

### verify root
root logger -> server
```
string; // password
```
expects 'accepted' or 'declined'

### accepted
server -> root logger
```
null
```

### declined
server -> root logger
```
null
```