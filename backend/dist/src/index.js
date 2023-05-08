"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const reclaim_sdk_1 = require("@reclaimprotocol/reclaim-sdk");
const cors_1 = __importDefault(require("cors"));
const connect_js_1 = require("../db/connect.js");
dotenv_1.default.config();
(0, connect_js_1.connectDb)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
//todo- move this to .env
const callbackUrl = "https://yc-alumni-verifier-production.up.railway.app/" + "/" + "callback/";
const reclaim = new reclaim_sdk_1.Reclaim(callbackUrl);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/home/yc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    console.log("params,", email);
    const emailStr = email;
    if (!email) {
        res.status(400).json({
            message: "400- bad request, email is required",
        });
        return;
    }
    const callbackId = "yc-" + (0, reclaim_sdk_1.generateUuid)();
    const template = (yield reclaim.connect("YC-Alumni-Verification", [
        {
            provider: "yc-login",
            params: {
                email: emailStr,
            },
        },
    ])).generateTemplate(callbackId);
    const url = template.url;
    const templateId = template.id;
    try {
        yield connect_js_1.SubmittedLink.create({
            callback_id: callbackId,
            email,
            status: "pending",
            template_id: templateId,
        });
    }
    catch (e) {
        res.status(400).json({
            message: `500 - Internal Server Error - ${e}`,
            erroor: e.message,
        });
        return;
    }
    res.json({
        url,
        callbackId,
    });
}));
app.get("/status/:callbackId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let statuses;
    console.log("paramsss", req.params.callbackId);
    if (!req.params.callbackId) {
        res.status(400).send(`400 - Bad Request: callbackId is required`);
        return;
    }
    const callbackId = req.params.callbackId;
    try {
        const results = yield connect_js_1.SubmittedLink.find({
            callback_id: callbackId,
        });
        console.log("resultsss", results);
        if (!results) {
            res.status(404).send(`404 - Not Found: callbackId not found`);
            return;
        }
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    try {
        statuses = yield connect_js_1.SubmittedLink.find({ callback_id: callbackId });
        console.log("statusssss", statuses);
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    res.json({ status: statuses === null || statuses === void 0 ? void 0 : statuses.status });
}));
app.use(express_1.default.text({ type: "*/*" }));
app.post("/callback/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        res.status(400).send(`400 - Bad Request: callbackId is required`);
        return;
    }
    if (!req.body) {
        res.status(400).send(`400 - Bad Request: body is required`);
        return;
    }
    const reqBody = JSON.parse(decodeURIComponent(req.body));
    console.log("req body", reqBody);
    if (!reqBody.claims || !reqBody.claims.length) {
        res.status(400).send(`400 - Bad Request: claims are required`);
        return;
    }
    const callbackId = req.params.id;
    const claims = { claims: reqBody.claims };
    try {
        const results = yield connect_js_1.SubmittedLink.find({
            callback_id: callbackId,
        });
        console.log("resultsss", results);
        if (!results) {
            res.status(404).send(`404 - Not Found: callbackId not found`);
            return;
        }
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    try {
        yield connect_js_1.SubmittedLink.findByIdAndUpdate({ callback_id: callbackId }, { status: "verified" });
    }
    catch (e) {
        res.status(500).send(`500 - Internal Server Error - ${e}`);
        return;
    }
    res.send(`<div
	style="
	  width: 100%;
	  height: 100%;
	  display: flex;
	  text-align: center;
	  justify-content: center;
	  align-items: center;
	"
  >
	<h1>
	  Submitted claim successfully! You are an verifiesd Alumni of YC
	</h1>
  </div>`);
}));
app.get("/", (req, res) => {
    res.send("YC Alumni verification backend is running..................");
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
