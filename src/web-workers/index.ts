/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { veridaClient } from "@/helpers";
import PromiseWorker from "promise-worker";
import Worker from "worker-loader!./worker";

const worker = new Worker();

const promiseWorker = new PromiseWorker(worker);

const send = async (message: unknown) => {
  const app = await veridaClient.initMessaging(message);
  return promiseWorker.postMessage({
    type: "message",
    app,
  });
};

export default {
  send,
};
