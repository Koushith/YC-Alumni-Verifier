// @ts-nocheck

import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Reclaim, generateUuid } from "@reclaimprotocol/reclaim-sdk";
import { SubmittedLink } from "../db/connect.js";

//todo- move this to .env
const callbackUrl =
  "https://yc-alumni-verifier-production.up.railway.app/" + "/" + "callback/";

const reclaim = new Reclaim(callbackUrl);

export const home = async (req: Request, res: Response) => {
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
          email: emailStr,
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
};
