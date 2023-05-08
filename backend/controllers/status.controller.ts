// @ts-nocheck
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { SubmittedLink } from "../db/connect.js";

export const status = async (req: Request, res: Response) => {
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
};
