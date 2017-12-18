var chai        = require('chai');

chai.should();

var eventbus = require('./eventbus');
describe('Eventbus lets you execute your business logic by providing sequential event/listener approach',function(){

    it("should not put 'on' prefix to event name if not exist",function(){
        var event = eventbus.event("MouseClick");
        event.name().should.equal("MouseClick");
    })


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

    it('event name with putting on prefix if needed should be assigned as method name, by default ', function(){
        eventbus.event('BadWordRemoved');
        var methodName = eventbus.event('BadWordRemoved').method();
        methodName.should.equal('onBadWordRemoved');
    })

    it('Listener can have method named different than default method of event',function(){
        var mailSent = false;
        var stock = 100;
        eventbus.event('OrderReady').setDefaultMethod('onOrderDone');
        eventbus.listener({sendAnEmail:function(source){mailSent = true;}}).withMethod('sendAnEmail').listen('OrderReady');
        eventbus.listener({decStock:function(source){stock = stock - source.amount;}}).withMethod('decStock').listen('OrderReady');
        eventbus.event('OrderReady').fire({food:'Pizza', amount: 5});
        mailSent.should.equal(true);
        stock.should.equal(95);
    })

});