const should = require('should');
const Request = require('../Request')

describe('Request', function () {
    describe('#getAttributes()', function () {
        it('should get the correct attributes of a request', function () {
            let message = {
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
                    timestamp: 452453534523,
                    locale: "zh-CN",
                    no_response: false,
                    event_type: "leavemsg.finished"
                }
            };
            let request = new Request(message);
            request.appId.should.be.exactly('123');
            request.query.should.be.exactly('hello');
            request.isEnterSkill.should.be.exactly(false);
            request.isInSkill.should.be.exactly(true);
            request.isQuitSkill.should.be.exactly(false);
            request.isNoResponse.should.be.exactly(false);
            request.isRecordFinish.should.be.exactly(true);
            request.isPlayFinishing.should.be.exactly(false);
        });
    });
});    
