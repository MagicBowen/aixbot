class Response {
    constructor() {
        this.body = {
            version  : "1.0",
            response : {
                open_mic : false
            },
            is_session_end : false
        }
    }

    speak(text) {
        this.body.response['to_speak'] = { type : 0, text :text};
        return this;
    }

    audio(url) {
        let item = { type: 'audio', audio_item : { stream: { url : url }}};

        if (!this.body.response.hasOwnProperty('directives')) {
            this.body.response['directives'] = [item];
            return this;
        }
        this.body.response.directives.push(item);
        return this;
    }
    
    appendTts(text) {
        let item = { type : 'tts', tts_item : { type : 'text', text : text}};

        if (!this.body.response.hasOwnProperty('directives')) {
            this.body.response['directives'] = [item];
            return this;
        }
        this.body.response.directives.push(item);
        return this;
    }

    display(type, url, text, template) {
        this.body.response['to_display'] = { 
            type : type, url : url, text : text, ui_template : template
        };
        return this;
    }

    openMic(flag = true) {
        this.body.response.open_mic = flag;
        return this;
    }

    closeSession(flag = true) {
        this.body.is_session_end = flag;
        return this;
    }

    notUnderstand(flag = true) {
        this.body.response['not_understand'] = flag;
        return this;
    }

    setSession(obj) {
        this.body.session_attributes = obj;
        return this;
    }

    record() {
        this.body.response['action'] = 'leave_msg';
        return this;
    }

    playMsgs(fileIdList) {
        this.body.response['action'] = 'play_msg';
        this.body.response['action_property'] = {file_id_list : fileIdList};
        return this;
    }

    registerPlayFinishing() {
        this.body.response['register_events'] = [{event_name : 'mediaplayer.playbacknearlyfinished'}];
        return this;
    }

    getBody() {
        return this.body;
    }
}

module.exports = Response;