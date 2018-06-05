class Request {
    constructor(req) {
        this._body = req;
    }

    get body() {
        return this._body;
    }

    get query() {
        return this.body.query;
    }

    get session() {
        return this.body.session;
    }

    get appId() {
        return this.session.application.app_id;
    }

    get user() {
        return this.session.user;
    }

    get context() {
        return this.body.context;
    }

    get slotInfo() {
        return this.body.request.slot_info;
    }

    get intentName() {
        if (!this.slotInfo) return null;
        return this.slotInfo.intent_name;
    }

    get eventType() {
        return this.body.request.event_type;
    }

    get eventProperty() {
        return this.body.request.event_property;
    }

    get requestId() {
        return this.body.request.request_id;
    }

    get requestType() {
        return this.body.request.type;
    }

    get isEnterSkill() {
        return (this.requestType === 0);
    }

    get isInSkill() {
        return (this.requestType === 1);
    }

    get isQuitSkill() {
        return (this.requestType === 2);
    }

    get isNoResponse() {
        if (!this.body.request.no_response) return false;
        return ((this.isInSkill) && this.body.request.no_response);
    }

    get isRecordFinish() {
        if (!this.eventType) return false;
        return ((this.isInSkill) && this.eventType === 'leavemsg.finished');
    }

    get isRecordFail() {
        if (!this.eventType) return false;
        return ((this.isInSkill) && this.eventType === 'leavemsg.failed');
    }

    get isPlayFinishing() {
        if (!this.eventType) return false;
        return ((this.isInSkill) && this.eventType === 'mediaplayer.playbacknearlyfinished');
    }
}

module.exports = Request;