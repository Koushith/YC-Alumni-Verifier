import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { extractGitHubRepoPath, handleError } from "../utils";
import Form, { Inputs } from "./Form";
import QrMessage from "./QrMessage";
import Device from "./static/Device";
import Gift from "./static/Svg/Gift";

const getCallbackUrl = "192.168.241.81:8000" + "/home";
console.log(getCallbackUrl);
const statusUrl = "192.168.241.81:8000" + "/status";
console.log(statusUrl);

export default function Main() {
  const [callbackId, setCallbackId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);

  const getStatus = async (callbackId: string) => {
    const response = await axios.get(
      "http://192.168.241.81:8000/status" + `/${callbackId}`
    );
    setStatus(response.data.status);
  };

  const getCallback = async (input: Inputs) => {
    const params = {
      email: input.email,
    };
    return toast.promise(
      axios.get("http://192.168.241.81:8000/home" + "/yc", {
        params,
      }),
      {
        loading: "Loading..",
        error: (error) => handleError(error),
        success: "Success",
      }
    );
  };

  const proveIt = async (input: Inputs) => {
    console.log("app was here");
    const response = await getCallback(input);
    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }
    setCallbackId(response.data.callbackId);
    setAppUrl(response.data.url);
  };

  useEffect(() => {
    if (!callbackId) return;

    const interval = setInterval(() => {
      getStatus(callbackId);
    }, 2000);

    return () => clearInterval(interval);
  }, [callbackId]);

  return (
    <div className="flex min-h-screen items-center w-full h-full max-w-90% lg:max-w-[70%] mx-auto justify-between gap-36 lg:gap-20 flex-col lg:flex-row flex-wrap  max-w-full p-2 lg:p-10 py-20">
      <div className="flex flex-col items-center justify-center max-w-full m-auto text-center lg:text-start lg:items-start">
        <Gift className="mb-10" />
        <div className="break-all">
          <h3
            className="text-yellow font-AgrandirGrandHeavy leading-[62px] font-extrabold text-5xl"
            style={{ color: "#E66221" }}
          >
            Trust in
          </h3>
          <h3 className="text-gray-700  font-AgrandirGrandHeavy leading-[62px] font-extrabold text-5xl">
            every
          </h3>
          <h3 className="text-gray-700  font-AgrandirGrandHeavy leading-[62px] font-extrabold text-5xl">
            Connection
          </h3>
        </div>
        <div className="mb-12">
          <h3 className="text-xl font-Fredoka text-gray-700  text-opacity-70">
            YC Aluminai Alumni Verification Platform
          </h3>
        </div>

        {status === "verified" ? (
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-yellow">
              <span className="opacity-100">🚀</span> Thanks for verification{" "}
              <span className="opacity-100">🚀</span>
            </h3>
          </div>
        ) : appUrl && callbackId ? (
          <QrMessage appUrl={appUrl} />
        ) : (
          <Form proveIt={proveIt} />
        )}
      </div>

      <div className="max-w-full m-auto">
        <Device />
      </div>
    </div>
  );
}
