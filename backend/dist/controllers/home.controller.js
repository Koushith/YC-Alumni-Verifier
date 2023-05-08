"use strict";
// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.home = void 0;
const reclaim_sdk_1 = require("@reclaimprotocol/reclaim-sdk");
const connect_js_1 = require("../db/connect.js");
//todo- move this to .env
const callbackUrl = "https://yc-alumni-verifier-production.up.railway.app/" + "/" + "callback/";
const reclaim = new reclaim_sdk_1.Reclaim(callbackUrl);
const home = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.home = home;
