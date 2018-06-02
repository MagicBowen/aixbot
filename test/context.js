const should = require('should');
const equal = require('deep-equal');
const Request = require('../Request')
const Context = require('../context')

describe('Context', function () {
    describe('#request()', function () {
        it('should get the request properties from context', function () {
            let request = {
                version: "1.0",
                query  : "hello",
                session: {
                    session_id: "xxxxx",
                    application: {
                    app_id: "123"
                    },
                    user: {
                        user_id: "456"
                    }
                },
                request: {
                    type: 1,
                    request_id: "ttttt",
                    no_response: false,
                    event_type: "leavemsg.finished"
                }
            };
            let context = new Context(new Request(request));
            context.request.appId.should.be.exactly('123');
            context.request.query.should.be.exactly('hello');
            context.request.isEnterSkill.should.be.exactly(false);
            context.request.isInSkill.should.be.exactly(true);
            context.request.isQuitSkill.should.be.exactly(false);
            context.request.isNoResponse.should.be.exactly(false);
            context.request.isRecordFinish.should.be.exactly(true);
            context.request.isPlayFinishing.should.be.exactly(false);
        });
    });
    describe('#response()', function () {
        it('should get the response properties from context', function () {
            let context = new Context(null);
            context.response.speak('hello');
            expect = { version: '1.0',
                       response: { open_mic: false, to_speak: { type: 0, text: 'hello' } },
                       is_session_end: false 
                    };
            equal(context.body, expect).should.be.exactly(true);
        });
        it('should delegate the response methods from context', function () {
            let context = new Context(null);
            context.speak('hello').openMic();
            expect = { version: '1.0',
                       response: { open_mic: true, to_speak: { type: 0, text: 'hello' } },
                       is_session_end: false 
                    };
            equal(context.body, expect).should.be.exactly(true);
        });
    });
});    
