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
exports.callback = void 0;
const connect_js_1 = require("../db/connect.js");
const callback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    console.log("claimsssss", claims);
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
        yield connect_js_1.SubmittedLink.findByIdAndUpdate({ callback_id: callbackId }, { status: "verified", claims: claims });
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
});
exports.callback = callback;
