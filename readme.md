# Wsocket.io Client

This is a client-side wrapper for the WebSocket native browser API. It makes it a lot easier to use WebSockets with Node JS by providing a simple to use API. Take a look at [https://github.com/danielkov/wsocket.io-server](wsocket.io-server) or [https://github.com/danielkov/wsocket.io](wsocket.io) for a full integration example.

### Browser support

Client code needs to be transpiled with something like [Babel](https://babeljs.io/) to work in all browsers. Currently only browsers supporting WebSocket API are supported (no fallback to AJAX).

## Supported methods

### API

### `.constructor([url: String <optional>])`
The parameter is the url to open a WebSocket connection with. This defaults to `window.location.hostname` on port: 8080.

### `.on([name: String], [fn: function <callback>])`
Handles incoming messages matching the name provided in the first parameter.

### `.send([name: String], [data: Object])`
Sends a message to the server with the name of first parameter and the data in the form of a stringified object.

### `.off([fn: function <callback, optional>])`
Closes open WebSocket connection if there is one and executes callback. If there aren't any open connections the callback will receive an error. If no callback is provided an Error will be thrown.
