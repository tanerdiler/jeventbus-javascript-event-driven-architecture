'use strict';

var absent = require('absent');
var types = require('the.types');

var TheEvent = function (_name) {

    var _defaultMethodName = _name;

    var nameIncludes_On_Prefix = function () {
        return _name.indexOf("on") === 0;
    }

    if (absent.not(nameIncludes_On_Prefix())) {
        _defaultMethodName = "on" + _name;
    }

    var listeners = types.array();

    this.name = function () {
        return _name;
    }

    this.method = function()
    {
        return _defaultMethodName;
    }

    this.setDefaultMethod = function(methodName)
    {
        _defaultMethodName = methodName;
    }

    this.fire = function (source) {
        var firingStopped = false;
        listeners.iterate(function (index, listener) {
            var keepContinue = true;
            if (absent.isNull(listener.providesCondition)
                || listener.providesCondition(source)) {
                keepContinue = listener.trigger(source);
                firingStopped = firingStopped && (absent.isSet(keepContinue) && keepContiue == false);

            }
            return keepContinue;
        });
        return absent.not(firingStopped);
    }

    this.addListener = function (listener) {
        listeners.add(listener);
        return this;
    }
}

var TheEvents = types.map();

var TheListener = function (object) {
    var self = this;
    var methodName = null;

    var conditionToTriggerListener = null;

    this.withMethod = function(_methodName)
    {
        methodName = _methodName;
        return self;
    }

    this.listen = function (eventNameParameter) {
        var event = TheEvents.get(eventNameParameter);
        if(absent.isNull(methodName))
        {
            methodName = event.method();
        }
        event.addListener(self);
        return self;
    }

    this.when = function (condition) {
        conditionToTriggerListener = condition;
        return self;
    }

    this.providesCondition = function (source) {
        if (absent.isNull(conditionToTriggerListener)) {
            return true;
        }
        return conditionToTriggerListener(source);
    }

    this.trigger = function (source) {
        return object[methodName](source);
    }
}

module.exports = {
    event : function (name) {

        var event = TheEvents.get(name);

        if (absent.isNull(event)) {
            event = new TheEvent(name);
            TheEvents.put(name, event);
        }

        return event;
    },

    listener : function(listenerObject)
    {
        return new TheListener(listenerObject);
    }
};


