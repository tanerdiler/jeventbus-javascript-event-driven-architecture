var chai        = require('chai');

chai.should();

var eventbus = require('./eventbus');
describe('Eventbus lets you execute your business logic by providing sequential event/listener approach',function(){

    it("should put 'on' prefix if name doesn't have",function(){
        var event = eventbus.event("MouseClick");
        event.name().should.equal("onMouseClick");
    })


    it('should create an event once',function(){
        var event_1 = eventbus.event('onMouseClick');
        var event_2 = eventbus.event('onMouseClick');
        event_1.should.equal(event_2);
    })

    it('should call listener if no condition specified',function(){
        var listenerCallingTimes = 0;
        eventbus.listener({onMouseClick:function () {listenerCallingTimes++;}}).listen('onMouseClick');
        eventbus.event('MouseClick').fire();
        listenerCallingTimes.should.equal(1);
    })

    it('should call two listeners if no condition specified',function(){
        var listenerCallingTimes = 0;
        eventbus.listener({onMouseClick:function () {listenerCallingTimes++;}}).listen('onMouseClick');
        eventbus.listener({onMouseClick:function () {listenerCallingTimes = listenerCallingTimes + 2;}}).listen('onMouseClick');
        eventbus.event('MouseClick').fire();
        listenerCallingTimes.should.equal(3);
    })

    it('should call listener once with condition',function(){
        var listenerCallingTimes = 0;
        var listener = eventbus.listener(
            {onMouseClick: function () {
                listenerCallingTimes++;
            }
            })
            .listen('onMouseClick')
            .when(
                function(source){
                    return listenerCallingTimes < 1;
                });
        eventbus.event('MouseClick').fire();
        eventbus.event('MouseClick').fire();
        listenerCallingTimes.should.equal(1);
    })

    it('should stop triggering next listeners', function(){
        var listenerCallingTimes = 0;
        eventbus.listener({onMouseClick:function () {listenerCallingTimes++; return false;}}).listen('onMouseClick');
        eventbus.listener({onMouseClick:function () {listenerCallingTimes = listenerCallingTimes + 2; return false;}}).listen('onMouseClick');
        eventbus.event('MouseClick').fire();
        listenerCallingTimes.should.equal(1);
    })

});