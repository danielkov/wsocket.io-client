const sortArgsIntoArray = require('./utils').sortArgsIntoArray;

module.exports = class Client {
  constructor(url) {
    this.handleFunctions = {};
    this.allHandlers = [];
    let _url = url || window.location.hostname + ':8080';
    if (!_url.startsWith('ws://')) {
			_url = 'ws://' + _url;
		}
    this.socket = new WebSocket(_url);
    this.socket.onmessage = (data) => {
      var d = JSON.parse(data.data);
      var messageName = d.name;
      if (this.allHandlers.length > 0) {
        for (let i = 0; i < this.allHandlers.length; i++) {
          this.allHandlers[i](d.name, d.data)
        }
      }
      this.executeHandler(messageName, d.data);
    }
  }
  executeHandler (name, data) {
    if (this.handleFunctions[name] && Array.isArray(this.handleFunctions[name])) {
      for (let i = 0; i < this.handleFunctions[name].length; i++) {
        if (typeof this.handleFunctions[name][i] === 'function') {
          this.handleFunctions[name][i](data);
        }else {
          // throw new Error(errors.notfunc); TODO: implement errors??? @danielkov
        }
      }
    }
  }
  send (name, data) {
    if (this.socket) {
      this.socket.send(JSON.stringify({name:name, data:data}));
    }
    else {
      throw new Error('No open WebSocket connections.')
    }
    return this;
  }
  on (name, fn, ...fns) {
    let _names = name.split(' ');
    let _fns = sortArgsIntoArray(fn, fns);
    if (_names.length > 1) {
      for (let i = _names.length - 1; i >= 0; i--) {
        this.subscribeToEvent(_names[i], _fns);
      }
    }
    else {
      this.subscribeToEvent(name, _fns);
    }
    return this;
  }
  subscribeToEvent (name, fn) {
    if (this.handleFunctions[name]) {
      this.handleFunctions[name] = this.handleFunctions[name].concat(fn);
    }
    else {
      this.handleFunctions[name] = fn
    }
  }
  all (...fns) {
    this.allHandlers = this.allHandlers.concat(fns);
    return this;
  }
  off (name) {
    let _names = name.split('');
    if (_names.length > 1) {
      for (let i = _names.length - 1; i > 0; i--) {
        this.handleFunctions[_names[i]] = null;
      }
    }
    else {
      this.handleFunctions[name] = null;
    }
    return this;
  }
  offAll () {
    this.handleFunctions = {};
    this.allHandlers = [];
    return this;
  }
  close (fn) {
    if (this.socket) {
      this.socket.close();
      this.handleFunctions = {};
      this.allHandlers = [];
      if (fn) fn(null);
    }
    else {
      if (fn) {
        fn(new Error('No open WebSocket connections on service.'));
      }
      else {
        throw new Error('No open WebSocket connections on service.')
      }
    }
    return this;
  }
}
