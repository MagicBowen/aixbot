class Response {
    constructor() {
        this._body = {
            version  : "1.0",
            response : {
                open_mic : false
            },
            is_session_end : false
        }
    }

    speak(text) {
        this._body.response['to_speak'] = { type : 0, text :text};
        return this;
    }

    audio(url) {
        let item = { type: 'audio', audio_item : { stream: { url : url }}};

        if (!this._body.response.hasOwnProperty('directives')) {
            this._body.response['directives'] = [item];
            return this;
        }
        this._body.response.directives.push(item);
        return this;
    }
    
    appendTts(text) {
        let item = { type : 'tts', tts_item : { type : 'text', text : text}};

        if (!this._body.response.hasOwnProperty('directives')) {
            this._body.response['directives'] = [item];
            return this;
        }
        this._body.response.directives.push(item);
        return this;
    }

    display(type, url, text, template) {
        this._body.response['to_display'] = { 
            type : type, url : url, text : text, ui_template : template
        };
        return this;
    }

    openMic(flag = true) {
        this._body.response.open_mic = flag;
        return this;
    }

    closeSession(flag = true) {
        this._body.is_session_end = flag;
        return this;
    }

    notUnderstand(flag = true) {
        this._body.response['not_understand'] = flag;
        return this;
    }

    setSession(obj) {
        this._body.session_attributes = obj;
        return this;
    }

    record() {
        this._body.response['action'] = 'leave_msg';
        return this;
    }

    playMsgs(fileIdList) {
        this._body.response['action'] = 'play_msg';
        this._body.response['action_property'] = {file_id_list : fileIdList};
        return this;
    }

    registerPlayFinishing() {
        this._body.response['register_events'] = [{event_name : 'mediaplayer.playbacknearlyfinished'}];
        return this;
    }

    get body() {
        return this._body;
    }
}

module.exports = Response;