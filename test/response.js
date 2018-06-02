const should = require('should');
const Response = require('../Response')

describe('Response', function () {
    describe('#getBody()', function () {
        it('should get the correct body of a response', function () {
            let response = new Response().speak('hello')
                                         .audio('http://www.xx.cn/audio.mp3')
                                         .playMsgs(['123.m'])
                                         .registerPlayFinishing()
                                         .openMic()
                                         .record()
                                         .closeSession();
            response.getMessage().should.be.exactly({
                "version": "1.0",
                "response": {
                    "open_mic": true,
                    "to_speak": {
                        "type": 0,
                        "text": "hello"
                    },
                    "directives": [ 
                        {
                            "type": "audio",
                            "audio_item": {
                            "stream": {
                                "url": "http://www.xx.cn/audio.mp3",
                                }
                            }
                        }
            　　　　 ]},
                    "action" : "leave_msg",
                    "action_property" : {"file_id_list" : ["123.m"]},
                    "register_events":[  
                        {  
                           "event_name":"mediaplayer.playbacknearlyfinished"
                        }
                     ],
　　　　             "is_session_end"  : true
            });                                         
        });
    });
});    
