/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { veridaClient } from "@/helpers";
import PromiseWorker from "promise-worker";
import Worker from "worker-loader!./worker";

const worker = new Worker();

const promiseWorker = new PromiseWorker(worker);

const send = async () => {
  const app = await veridaClient.initialiseMessagingInstance();
  return promiseWorker.postMessage({
    type: "message",
    app,
  });
};

export default {
  send,
};
