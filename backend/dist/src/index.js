"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connect_js_1 = require("../db/connect.js");
const home_controller_js_1 = require("../controllers/home.controller.js");
const status_controller_js_1 = require("../controllers/status.controller.js");
const callback_controller_js_1 = require("../controllers/callback.controller.js");
dotenv_1.default.config();
(0, connect_js_1.connectDb)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/home/yc", home_controller_js_1.home);
app.get("/status/:callbackId", status_controller_js_1.status);
app.use(express_1.default.text({ type: "*/*" }));
app.post("/callback/:id", callback_controller_js_1.callback);
app.get("/", (req, res) => {
    res.send("YC Alumni verification backend is running..................");
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
