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

    reply(text) {
        return this.speak(text);
    }

    query(text) {
        return this.speak(text).openMic();
    }

    wait() {
        return this.openMic(true);
    }

    directiveAudio(url, token, offsetMs) {
        let item = { type: 'audio', audio_item : {stream: { url : url}}};

        if (token) item.audio_item.stream['token'] = token;
        if (offsetMs) item.audio_item.stream['offset_in_milliseconds'] = offsetMs;

        return this.appendToDirectives(item);
    }
    
    directiveTts(text) {
        return this.appendToDirectives({type : 'tts', tts_item : { type : 'text', text : text}});
    }
    
    directiveRecord(fileId) {
        return this.appendToDirectives({type : 'file_id', file_id_item : {file_id : fileId}});
    }

    appendToDirectives(item) {
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
        this.openMic();
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

    launchQuickApp(path) {
        this._body.response['action'] = 'App.LaunchQuickApp';
        this._body.response['action_property'] = {quick_app_path : path};
        return this;        
    }

    launchApp(type, uri, permission) {
        // type should be : [activity|service|broadcast]
        this._body.response['action'] = 'App.LaunchIntent';
        let info = {intent_type : type, uri : uri};
        if (permission) info.permission = permission;
        this._body.response['action_property'] = {app_intent_info : info};
        return this;        
    }

    get body() {
        return this._body;
    }
}

module.exports = Response;