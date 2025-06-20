"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSessionSocket = void 0;
const handleSessionSocket = (req, res, next) => {
    res.clearCookie('connect.sid');
    const socketId = req.query.socketId;
    if (socketId) {
        req.session.socketId = socketId;
        req.session.save((err) => {
            if (err)
                console.error('Session save error:', err);
            next();
        });
    }
    else {
        next();
    }
};
exports.handleSessionSocket = handleSessionSocket;
