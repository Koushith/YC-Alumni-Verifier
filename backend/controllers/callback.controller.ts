// @ts-nocheck
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { SubmittedLink } from "../db/connect.js";

export const callback = async (req: Request, res: Response) => {
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
      { status: "verified", claims: claims }
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
};
