const should = require('should');
const AixBot = require('../')

describe('AixBot', function () {
    describe('#getAppId()', function () {
        it('should get the correct app id', function () {
            const aixbot = new AixBot('12345');
            aixbot.appId.should.be.exactly('12345');
        });
    });
    describe('#onEvent()', function () {
        it('should set handler for valid event type', function () {
            const aixbot = new AixBot('12345');
            let handler = () => {};
            aixbot.onEvent('enterSkill', handler);
            aixbot.eventListeners.enterSkill.should.be.exactly(handler);
        });
        it('should throw exception for invalid event type', function () {
            const aixbot = new AixBot('12345');
            should(function() {aixbot.onEvent('enterSkills', () => {})}).throw();
        });
        it('should throw exception for null handler type', function () {
            const aixbot = new AixBot('12345');
            should(function() {aixbot.onEvent('enterSkill')}).throw();
        });
        it('should throw exception for invalid handler type', function () {
            const aixbot = new AixBot('12345');
            should(function() {aixbot.onEvent('enterSkill', 123)}).throw();
        });
    });
    describe('#handleRequest()', function() {
        it('should invoke event handler for valid request', async function () {
            const aixbot = new AixBot('12345');

            let handlerEntered = false;

            aixbot.onEvent('enterSkill', function(ctx) {
                handlerEntered=true;
            });

            await aixbot.handleRequest({ session: { 
                                          application: { app_id: "12345"}, user: {user_id: "456"}}
                                        , request: {type: 0}}
                                     );

            handlerEntered.should.be.exactly(true);
        });
        it('should not invoke event handler for invalid app id', async function () {
            const aixbot = new AixBot('12345');

            let handlerEntered = false;

            aixbot.onEvent('enterSkill', function(ctx) {
                handlerEntered=true;
            });

            await aixbot.handleRequest({ session: {
                                          application: {app_id: "1234"}, user: {user_id: "456"}}
                                      , request: {type: 0}}
                                      );

            handlerEntered.should.be.exactly(false);
        });
        it('should not invoke enter skill event handler for quit skill request', async function () {
            const aixbot = new AixBot('12345');

            let eventType = -1;

            aixbot.onEvent('enterSkill', function(ctx) {
                eventType = 0;
            });
            
            aixbot.onEvent('quitSkill', function(ctx) {
                eventType = 2;
            });

            await aixbot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , request: {type: 2}}
                                      );

            eventType.should.be.exactly(2);
        });
        it('should invoke intent handler for intent request', async function () {
            const aixbot = new AixBot('12345');

            let intentHandled = false;

            aixbot.onIntent('query-name', function(ctx) {
                intentHandled = true;
            });

            await aixbot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , request: {type: 1, slot_info: {intent_name : 'query-name'}}}
                                      );

            intentHandled.should.be.exactly(true);
        });
        it('should not invoke intent handler for unmatched intent name request', async function () {
            const aixbot = new AixBot('12345');

            let intentHandled = false;

            aixbot.onIntent('query-name', function(ctx) {
                intentHandled = true;
            });

            await aixbot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , request: {type: 1, slot_info: {intent_name : 'query-sex'}}}
                                      );

            intentHandled.should.be.exactly(false);
        });
        it('should invoke text handler for matched query text request', async function () {
            const aixbot = new AixBot('12345');

            let textHandled = false;

            aixbot.hears('hello', function(ctx) {
                textHandled = true;
            });

            await aixbot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , query: 'hello'
                                      , request: {type: 1}}
                                      );

            textHandled.should.be.exactly(true);
        });
        it('should invoke regex handler for matched query text request', async function () {
            const aixbot = new AixBot('12345');

            let regexHandled = false;

            aixbot.hears(/\w+/, function(ctx) {
                regexHandled = true;
            });

            await aixbot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , query: 'hello'
                                      , request: {type: 1}}
                                      );

            regexHandled.should.be.exactly(true);
        });
        it('should not invoke regex handler for unmatched query text request', async function () {
            const aixbot = new AixBot('12345');

            let regexHandled = false;

            aixbot.hears(/\d+/, function(ctx) {
                regexHandled = true;
            });

            await aixbot.handleRequest({ session: {
                                          application: {app_id: "12345"}, user: {user_id: "456"}}
                                      , query: 'hello'
                                      , request: {type: 1}}
                                      );

            regexHandled.should.be.exactly(false);
        });
    });
});