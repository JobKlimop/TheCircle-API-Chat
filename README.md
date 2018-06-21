# TheCircle-API-Chat
[![Build Status](https://www.travis-ci.com/KoenKamman/TheCircle-API-Chat.svg?branch=develop)](https://www.travis-ci.com/KoenKamman/TheCircle-API-Chat)

Dit document wordt aangepast als er aanpassingen of toevoegingen plaatsvinden op de server.

The Circle - Chat Server
-

De chatserver maakt gebruik van een Javascript framework genaamd Socket.io. De chat bestaat uit een cluster van servers. Hieronder de gebruikte URLs: <br/>
- Angular WebApp:    https://the-circle-chat2.herokuapp.com/ <br/>
- Android App:        https://the-circle-chat3.herokuapp.com/ <br/>

Ook wordt er gebruik gemaakt van een Redis database die staat gehost bij Redis Labs, en een MongoDB database die gehost staat bij mLab. De Redis database wordt gebruikt voor het toepassen van de betreffende clustering, de MongoDB database voor het opslaan van chatberichten.

Op de server wordt gebruik gemaakt van een server side npm package die wordt aangeboden door socket.io, om hiermee verbinding te kunnen maken moet aan de client kant gebruik gemaakt worden van een socket.io client package.

In de documentatie van socket.io & in een voorbeeld op onze github staan de verschillende events beschreven die je kan versturen en ontvangen. Er wordt gebruik gemaakt van een aantal custom events die niet staan beschreven in de documentatie, deze staan alleen beschreven in het voorbeeld op github en in dit document.

Om gebruik te maken van deze events moet je als user eerst geverifieerd worden door middel van een certificaat. Vervolgens kan je subscriben op één of meerdere rooms, waarvan je vervolgens berichten ontvangt. Ons voorstel is om voor de naam van de room de username van de bijbehorende streamer te gebruiken.

Scalability
-

De server maakt gebruik van clustering, waardoor de applicatie horizontaal en verticaal geschaald kan worden. Door een server uit te rusten met een cpu die meer cores tot zijn beschikking heeft, kunnen er meer processen op één server gedraaid worden. Horizontaal kan er geschaald worden door meerdere servers toe te voegen (of meerdere web dyno’s toe te voegen op heroku). <br/>

Local Development
-

Om de server lokaal te draaien moet je een Redis database draaien op je pc, deze kan hier gedownload en geïnstalleerd worden als windows service: <br/>
https://github.com/MicrosoftArchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.msi

Vervolgens kan je de server starten met het volgende npm commando: <br/>
`
npm run dev
` <br/>

Om vervolgens verbinding te maken vanaf de client, kan het volgende stuk code gebruikt worden (als je gebruikt maakt van socket.io-client).
```
const host = "ws://localhost:3000";
let socket = require("socket.io-client")(host, {
    transports: ['websocket'],
    rejectUnauthorized: false
});
```

Production
-
Verbinden met de production server gaat op dezelfde manier, alleen vervang je hier de host variabele door: <br/>
- ws://the-circle-chat2.herokuapp.com/ <br/>
- ws://the-circle-chat3.herokuapp.com/ <br/>

Custom Events
-
In deze sectie van het document worden de custom events op dezelfde manier weergegeven als in de documentatie op socket.io, om verwarring te voorkomen.

### RECEIVING EVENTS

#### Event: ‘message’
 - **message** (Object) contains fields below:
 - *timestamp* (Date) when the message was sent from the server.
 - *room* (String) room the message is meant for.
 - *user* (String) username of the message sender.
 - *content* (String) the actual content of the message.
 - *certificate* (String) certificate of the message author.
 - *signature* (String) signature to verify integrity/authenticity of message.
 
Fired upon receiving a message from the server.
```
socket.on(‘message’, (message) => {
    // ...
});
```

#### Event: ‘verified’
 - *verified* (Boolean) boolean telling if user verification was successful or not.

Fired upon receiving verification info from the server.
```
socket.on(‘verified’, (verified) => {
    // ...
});
```

#### Event: ‘connection_info’
- **info** (Object) contains user, rooms, server, dyno, pid & identity:
- *user* (String) username associated with the connection.
- *rooms*  (String[]) array of rooms the connection is subscribed to.
- *server* (String) server address.
- *dyno* (String) heroku dyno.
- *pid* (Number) worker process.
- *identity* (Object) user information read from certificate.

Fired upon receiving connection info from the server.
```
socket.on(‘connection_info’, (info) => {
    // ...
});
```

#### Event: ‘room_joined’
- *room* (String) room the connection subscribed to.

Fired upon joining a room.
```
socket.on(‘room_joined’, (room) => {
    // ...
});
```

#### Event: ‘room_left’
- *room* (String) room the connection unsubscribed from.

Fired upon leaving a room.
```
socket.on(‘room_left’, (room) => {
    // ...
});
```

#### Event: ‘client_count’
- **response** (Object) contains room & numberOfClients:
- *room* (String) room the numberOfClients was requested for.
- *numberOfClients* (Number) number of clients connected to a given room.

Fired upon receiving client count information from the server.
```
socket.on(‘client_count’, (response) => {
    // ...
});
```

#### Event: ‘history’
- **response** (Object) contains room & history:
- *room* (String) room the history was requested for.
- *history* (Array) array with last 10 messages, sorted by time.

Fired upon receiving chatroom history from the server.
```
socket.on(‘history’, (response) => {
    // ...
});
```

### EMITTING EVENTS

#### Event: ‘message’
- **message** (Object) should contain fields below:
- *timestamp*  (Date) when the message is sent.
- *room* (String) room the message is meant for.
- *user* (String) username of the message sender.
- *content* (String) the actual content of the message.
- *certificate* (String) certificate of the message author.
- *signature* (String) signature to verify integrity/authenticity of message.

Emit this event to send a message to a room. You need to be subscribed to a room and must be verified to send messages.
```
socket.emit(‘message’, message);
```

#### Event: ‘verify_identity’
- *Object* (String) object containing certificate.

Emit this event to establish a usable connection by verifying a user using a certificate. A connection (user) must be verified before other events are available.
```
socket.emit(‘verify_identity’, {certificate: ‘certificate’});
```

#### Event: ‘join_room’
- *room* (String) room you want to subscribe to.

Emit this event to subscribe to a room.
```
socket.emit(‘join_room’, room);
```

#### Event: ‘leave_room’
- *room* (String) room you want to unsubscribe from.

Emit this event to unsubscribe from a room.
```
socket.emit(‘leave_room’, room);
```

#### Event: ‘connection_info’

Emit this event to request connection info from the server.
```
socket.emit(‘connection_info’);
```

#### Event: ‘client_count’
- *room* (String) room you want to receive number of connected clients from.

Emit this event to request the number of connected clients subscribed to a room. Only works if you are subscribed to the same room.
```
socket.emit(‘client_count’, room);
```

#### Event: ‘history’
- *room* (String) room you want to receive history from.

Emit this event to request the last 10 messages (filtered by timestamp) from specified room. Only works if you are subscribed to the same room.
```
socket.emit(‘history’, room);
```
