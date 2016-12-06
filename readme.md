# Wsocket.io Client

This is a client-side wrapper for the WebSocket native browser API. It makes it a lot easier to use WebSockets with Node JS by providing a simple to use API. Take a look at [wsocket.io-server](https://github.com/danielkov/wsocket.io-server) or [wsocket.io](https://github.com/danielkov/wsocket.io) for a full integration example.

### Browser support

Client code needs to be transpiled with something like [Babel](https://babeljs.io/) to work in all browsers. Currently only browsers supporting WebSocket API are supported (no fallback to AJAX).

## Supported methods

### API

### `.constructor([url: String <optional>])`
The parameter is the url to open a WebSocket connection with. This defaults to `window.location.hostname` on port: 8080. Example usage:

```js
import WSClient from 'wsocket.io-client';

const ws = new WSClient('ws://www.myamazingwebsite.com:4200');
```

### `.on([name: String], [fn: Function | Array <callback>])`
Handles incoming messages matching the name provided in the first parameter. This method supports subscription to multiple events via space-separated names. The callback to execute can be an anonymous or named function, an array of functions or multiple functions as well. Example usage:

```js
function handleWsEvents (data) {
  document.querySelector('#log-screen').innerHTML = data.message;
}

ws.on('message signedup userloggedin', data => {
  console.log(`Data received: ${data}`);
}, handleWsEvents);
```

This method returns `this`, for easy chaining.
Note, you can subscribe to events that already have a handler attached to them, which will not overwrite but also include the handler you passed into the method. Example:

```js
ws.on('message userloggedin signedup', data => {
  console.log(data);
})
.on('message', data => {
  console.log(`Received message: ${data.message}!`)
}, data => {
  User.messages.push(data);
})
```

### `.all([fn: Function])`
Subscribes to every message received via websocket. The callback function is different from the rest, because it receives 2 parameters, the name and the data. This helps distinguish the message type, if a custom form of handling is required for a set of events. This method can accept multiple functions as an argument, in which case each of the functions is going to be executed in order. Example usage:

```js
ws.all((name, data) => {
  if (name.startsWith('message')) {
    console.log(`We received a new message: ${data}`);
  }
  else {
    console.log(`We received an unknown WebSocket message: ${data}`);
  }
})
```

This method returns `this`, for easy chaining.

### `.offAll()`
Removes all event listeners from the WebSocket connection. Example usage:

```js
ws.offAll(); // Stops listening to events without closing the connection.
```

This method returns `this`, for easy chaining.

### `.send([name: String], [data: Object])`
Sends a message to the server with the name of first parameter and the data in the form of a stringified object. Example usage:

```js
ws.send('message', {user: 'John', message: 'Hey there', emote: 'smile'});
```

This method returns `this`, for easy chaining.

### `.off([name: String])`
Removes all event handlers associated with the name provided in the parameters. This functions supports removing events from multiple listeners. Example usage:

```js
ws.off('message userloggedin'); // Unsubscribes all messages with the names: 'message' and 'userloggedin'.
```

This method returns `this`, for easy chaining.

### `.close([fn: Function <callback, optional>])`
Closes open WebSocket connection if there is one and executes callback. If there aren't any open connections the callback will receive an error. If no callback is provided an Error will be thrown.

This method returns `this`, for easy chaining.

### Extending the Constructor class
Because both the server, the socket and the client are just ES6 classes, all ES6 features also work on them by standard. For example you could do something like this:

```js
import { Client } from 'wsocket.io-client';

// This is the minimum requirement for extending the class.
class AwesomeClient extends Client {
  constructor () {
    super('ws://www.awesome-only.com:4200');
  }
}

let aws = new AwesomeClient();

aws.on('awesome-message', data => {
  console.log('Received an awesome message: ' + data.message);
})
```
