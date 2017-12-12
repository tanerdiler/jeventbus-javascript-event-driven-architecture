# eventbus

[![Build Status](https://travis-ci.org/tanerdiler/eventbus.js.svg?branch=master)](https://travis-ci.org/tanerdiler/eventbus.js)
[![Coverage Status](https://coveralls.io/repos/github/tanerdiler/eventbus.js/badge.svg?branch=master)](https://coveralls.io/github/tanerdiler/eventbus.js?branch=master)

eventbus is a sequential event/listener mechanism.

## What is the goal of this project?

Eventbus triggers listeners sequentially for an event. The most important benefit of this approach is that it allows you to split your business logic into small pieces. Each piece is a listener and each listener has own logic (single responsbility principle). I used this approach in many Javascript projects. It allows me to inject logics into any step and that made application more flexible. While triggering, if one listener returns false, it brakes execution of next listeners. So, this feature allows you to control logic by injecting stoppers.

## Installation

```bash
$ npm install --save eventbus
```

## Usage


```javascript
var eventbus = require('the.eventbus');

var MyListener = function()
{
   this.onClick = function(source){
   
	console.log(source['firstname']);
   }
}

eventbus.event('onClick');
eventbus.listener(new MyListener()).listen('onClick');
eventbus.event('onClick').fire({firstname:'taner'});

```

## Versions
### 1.0.2
#### Added
..* Specifiying default method that would be triggered when event fired
..* Unless default method is specified, event name will be assigned as default method by putting on prefix if needed.
#### Removed
..* Automatically putting 'on' prefix to event name  while creating an event

## Test

This module is well tested. You can run:

- `npm test` to run the tests under Node.js.

![Test results](https://github.com/tanerdiler/types.js/blob/master/test-results.png)

## License

[MIT](LICENSE)

