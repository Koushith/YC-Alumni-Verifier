// @ts-nocheck
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Reclaim, generateUuid } from "@reclaimprotocol/reclaim-sdk";
import cors from "cors";
import { SubmittedLink, connectDb } from "../db/connect.js";

dotenv.config();
connectDb();

const app: Express = express();
const port = process.env.PORT || 8000;

const callbackUrl = "192.168.241.81:8000" + "/" + "callback/";

const reclaim = new Reclaim(callbackUrl);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.get("/home/yc", async (req, res) => {
  const { email } = req.query;

  console.log("params,", email);
  const emailStr = email as string;

  if (!email) {
    res.status(400).json({
      message: "400- bad request, email is required",
    });

    return;
  }

  const callbackId = "yc-" + generateUuid();

  const template = (
    await reclaim.connect("YC-Alumni-Verification", [
      {
        provider: "yc-login",
        params: {
          // email: emailStr,
        },
      },
    ])
  ).generateTemplate(callbackId);

  const url = template.url;
  const templateId = template.id;

  try {
    await SubmittedLink.create({
      callback_id: callbackId,
      email,
      status: "pending",
      template_id: templateId,
    });
  } catch (e) {
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

app.get("/status/:callbackId", async (req: Request, res: Response) => {
  let statuses;
  console.log("paramsss", req.params.callbackId);
  if (!req.params.callbackId) {
    res.status(400).send(`400 - Bad Request: callbackId is required`);
    return;
  }

  const callbackId = req.params.callbackId;

  try {
    const results = await SubmittedLink.find({
      callback_id: callbackId,
    });

    console.log("resultsss", results);
    if (!results) {
      res.status(404).send(`404 - Not Found: callbackId not found`);
      return;
    }
  } catch (e) {
    res.status(500).send(`500 - Internal Server Error - ${e}`);
    return;
  }

  try {
    statuses = await SubmittedLink.find({ callback_id: callbackId });
    console.log("statusssss", statuses);
  } catch (e) {
    res.status(500).send(`500 - Internal Server Error - ${e}`);
    return;
  }

  res.json({ status: statuses?.status });
});

app.use(express.text({ type: "*/*" }));

app.post("/callback/:id", async (req: Request, res: Response) => {
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
    const results = await SubmittedLink.find({
      callback_id: callbackId,
    });

    console.log("resultsss", results);
    if (!results) {
      res.status(404).send(`404 - Not Found: callbackId not found`);
      return;
    }
  } catch (e) {
    res.status(500).send(`500 - Internal Server Error - ${e}`);
    return;
  }

  try {
    await SubmittedLink.findByIdAndUpdate(
      { callback_id: callbackId },
      { status: "verified" }
    );
  } catch (e) {
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

app.get("/", (req, res) => {
  res.send("YC Alumni verification backend is running..................");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
