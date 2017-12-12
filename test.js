var chai        = require('chai');

chai.should();

var eventbus = require('./eventbus');
describe('Eventbus lets you execute your business logic by providing sequential event/listener approach',function(){

    it('should create an event once',function(){
        var event_1 = eventbus.event('onMouseClick');
        var event_2 = eventbus.event('onMouseClick');
        event_1.should.equal(event_2);
    })

    it('should call listener if no condition specified',function(){

        var listenerCallingTimes = 0;
        eventbus.event('MouseOver')
        eventbus.listener({onMouseOver:function () {listenerCallingTimes++;}}).listen('MouseOver');
        eventbus.event('MouseOver').fire();

        listenerCallingTimes.should.equal(1);
    })

    it('should call two listeners if no condition specified',function(){
        var listenerCallingTimes = 0;
        eventbus.event('MouseOut');
        eventbus.listener({onMouseOut:function () {listenerCallingTimes++;}}).listen('MouseOut');
        eventbus.listener({onMouseOut:function () {listenerCallingTimes = listenerCallingTimes + 2;}}).listen('MouseOut');
        eventbus.event('MouseOut').fire();
        listenerCallingTimes.should.equal(3);
    })

    it('should call listener once with condition',function(){
        var listenerCallingTimes = 0;
        eventbus.event('KeyDown');
        var listener = eventbus.listener(
            {onKeyDown: function () {
                listenerCallingTimes++;
            }
            })
            .listen('KeyDown')
            .when(
                function(source){
                    return listenerCallingTimes < 1;
                });
        eventbus.event('KeyDown').fire();
        eventbus.event('KeyDown').fire();
        listenerCallingTimes.should.equal(1);
    })

    it('should stop triggering next listeners', function(){
        var listenerCallingTimes = 0;
        eventbus.event('KeyUp');
        eventbus.listener({onKeyUp:function () {listenerCallingTimes++; return false;}}).listen('KeyUp');
        eventbus.listener({onKeyUp:function () {listenerCallingTimes = listenerCallingTimes + 2; return false;}}).listen('KeyUp');
        eventbus.event('KeyUp').fire();
        listenerCallingTimes.should.equal(1);
    })

    it('event should be named different than method name', function(){
        var listenerCallingTimes = 0;
        eventbus.event('BadWordDetection').setDefaultMethod('aBadWordDetected');
        eventbus.listener({aBadWordDetected:function(source){listenerCallingTimes++;}}).listen('BadWordDetection');
        eventbus.event('BadWordDetection').fire({badword:'nothing'});
        listenerCallingTimes.should.equal(1);
    })

    it('event name should be assigned to method name with putting on prefix if needed, by default ', function(){
        var listenerCallingTimes = 0;
        eventbus.event('BadWordRemoved');
        eventbus.listener({onBadWordRemoved:function(source){listenerCallingTimes++;}}).listen('BadWordRemoved');
        eventbus.event('BadWordRemoved').fire({badword:'nothing'});
        listenerCallingTimes.should.equal(1);
    })

});