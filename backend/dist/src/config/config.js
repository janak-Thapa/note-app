"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const _config = {
    port: process.env.PORT,
    clinetUri: process.env.CLIENT_URL,
    databaseUrl: process.env.MONGO_URI,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET_KEY,
    //   cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
    //   cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    //   cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
    //   frontendDomain: process.env.FRONTEND_DOMAIN,
};
exports.config = Object.freeze(_config);
