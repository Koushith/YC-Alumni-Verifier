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
exports.SubmittedLink = exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//Todo - move this to .env
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield mongoose_1.default.connect("mongodb+srv://koushith:koushith97!@cluster0.mvgle.mongodb.net/?retryWrites=true&w=majority");
        console.log("Connected to Mongo DB", conn.connection.host);
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
});
exports.connectDb = connectDb;
const submittedLinkSchema = new mongoose_1.default.Schema({
    callback_id: { type: String, required: true },
    claims: { type: Boolean, required: false },
    status: { type: String, required: true },
    email: { type: String, required: true },
    template_id: { type: String, required: false },
});
exports.SubmittedLink = mongoose_1.default.model("SubmittedLink", submittedLinkSchema);
