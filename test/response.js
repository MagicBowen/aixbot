const should = require('should');
const equal = require('deep-equal');
const Response = require('../response')

describe('Response', function () {
    describe('#getBody()', function () {
        it('should get the correct speak response', function () {
            let response = new Response().reply('hello');
            let expect = {
                version: "1.0",
                is_session_end  : false,
                response: {
                    open_mic: false,
                    to_speak: {
                        type: 0,
                        text: "hello"
                    }
                }
            };
            equal(response.body, expect).should.be.exactly(true); 
        });
        it('should get the correct audio response', function () {
            let response = new Response().directiveAudio('http://www.xx.cn/audio.mp3');
            let expect = {
                version: "1.0",
                is_session_end  : false,
                response: {
                    open_mic: false,
                    directives: [ 
                        {
                            type: "audio",
                            audio_item: {
                            stream: {
                                url: "http://www.xx.cn/audio.mp3",
                                }
                            }
                        }
            　　　　 ],
                }
            };
            equal(response.body, expect).should.be.exactly(true); 
        });
        it('should get the correct action response', function () {
            let response = new Response().record();
            let expect = {
                version: "1.0",
                is_session_end  : false,
                response: {
                    open_mic: true,
                    action : "leave_msg"
                }
            };
            equal(response.body, expect).should.be.exactly(true); 
        });        
        it('should get the correct open mic response', function () {
            let response = new Response().query('hello');
            let expect = {
                version: "1.0",
                is_session_end  : false,
                response: {
                    open_mic: true,
                    to_speak: {
                        type: 0,
                        text: "hello"
                    }
                }
            };
            equal(response.body, expect).should.be.exactly(true); 
        });        
        it('should get the correct close session response', function () {
            let response = new Response().reply('hello').closeSession();
            let expect = {
                version: "1.0",
                is_session_end  : true,
                response: {
                    open_mic: false,
                    to_speak: {
                        type: 0,
                        text: "hello"
                    }
                }
            };
            equal(response.body, expect).should.be.exactly(true); 
        });      
        it('should get the correct playing record response', function () {
            let response = new Response().playMsgs(['123.m']).registerPlayFinishing();
            let actual = response.body;
            let expect = {
                version: "1.0",
                is_session_end  : false,
                response: {
                    open_mic: false,
                    action : "play_msg",
                    action_property : {file_id_list : ["123.m"]},
                    register_events:[  
                        {  
                           event_name:"mediaplayer.playbacknearlyfinished"
                        }
                     ]
                }
            }                             
            equal(expect, actual).should.be.exactly(true); 
        });
        it('should get the correct launch quick app response', function () {
            let response = new Response().launchQuickApp('/');
            let actual = response.body;
            let expect = {
                version: "1.0",
                is_session_end  : false,
                response: {
                    open_mic: false,
                    action : "App.LaunchQuickApp",
                    action_property : {quick_app_path : '/'}
                }
            }                             
            equal(expect, actual).should.be.exactly(true); 
        });
        it('should get the correct launch app response', function () {
            let response = new Response().launchApp('activity', 'xxx');
            let actual = response.body;
            let expect = {
                version: "1.0",
                is_session_end  : false,
                response: {
                    open_mic: false,
                    action : "App.LaunchIntent",
                    action_property : {app_intent_info : {intent_type : 'activity', uri : 'xxx'}}
                }
            }                             
            equal(expect, actual).should.be.exactly(true); 
        });
    });
});    
