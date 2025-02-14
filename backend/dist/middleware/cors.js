"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};
exports.default = corsOptions;
//# sourceMappingURL=cors.js.map