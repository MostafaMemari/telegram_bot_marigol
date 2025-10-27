"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WP_API = exports.WP_APP_PASSWORD = exports.WP_USER = exports.BOT_TOKEN = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.WP_USER = process.env.WP_USER;
exports.WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;
exports.WP_API = process.env.WP_API;
