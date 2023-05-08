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
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const connect_js_1 = require("../db/connect.js");
const status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.status = status;
