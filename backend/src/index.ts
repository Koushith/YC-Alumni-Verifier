// @ts-nocheck
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Reclaim, generateUuid } from "@reclaimprotocol/reclaim-sdk";
import cors from "cors";
import { SubmittedLink, connectDb } from "../db/connect.js";
import { home } from "../controllers/home.controller.js";
import { status } from "../controllers/status.controller.js";
import { callback } from "../controllers/callback.controller.js";

dotenv.config();
connectDb();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/home/yc", home);

app.get("/status/:callbackId", status);

app.use(express.text({ type: "*/*" }));

app.post("/callback/:id", callback);

app.get("/", (req, res) => {
  res.send("YC Alumni verification backend is running..................");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
