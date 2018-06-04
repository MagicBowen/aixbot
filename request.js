class Request {
    constructor(req) {
        this.body = req;
        this.appId = req.session.application.app_id;
        this.query = req.query;
        this.user = req.session.user;
        if (req.request.slot_info) {
            this.intent = req.request.slot_info.intent_name;
        }
        this.isEnterSkill = (req.request.type == 0);
        this.isInSkill = (req.request.type == 1);
        this.isQuitSkill = (req.request.type == 2);
        this.isNoResponse = req.request.no_response ? ((req.request.type == 1) && req.request.no_response) : false;
        this.isRecordFinish = ((req.request.type == 1) && (req.request.event_type == 'leavemsg.finished'));
        this.isRecordFail = ((req.request.type == 1) && (req.request.event_type == 'leavemsg.failed'));
        this.isPlayFinishing = ((req.request.type == 1) && (req.request.event_type == 'mediaplayer.playbacknearlyfinished'));
    }
}

module.exports = Request;