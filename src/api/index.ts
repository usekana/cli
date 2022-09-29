import fetch from "node-fetch";
import ora from "ora";
import { getRoute } from "../constants/index.js";
import { KanaConfig } from "../model/index.js";
import { getApiKey } from "../store/credentials.js";

const getHeaders = async (isLive: boolean) => ({
  "Content-Type": "application/json",
  Authorization: await getApiKey(isLive),
});

namespace Api {
  export const validate = async (file: any, isLive: boolean) => {
    const headers = await getHeaders(isLive);
    const spinner = ora("Validating...").start();
    return fetch(getRoute().validate, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(file),
    })
      .then((data) => data.json())
      .finally(() => spinner.stop());
  };

  export const publish = async (file: any, isLive: boolean) => {
    const headers = await getHeaders(isLive);
    const spinner = ora("Publishing...").start();
    const result = await fetch(getRoute().publish, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(file),
    });
    spinner.stop();

    if (result.status > 399) {
      throw result.statusText;
    }

    const parsed = (await result.json()) as KanaConfig;
    return parsed;
  };

  export const pull = async (isLive: boolean) => {
    const headers = await getHeaders(isLive);
    const spinner = ora("Pulling...").start();
    const result = await fetch(getRoute().pull, {
      headers: headers,
    });

    spinner.stop();

    if (result.status > 399) {
      throw result.statusText;
    }

    const parsed = (await result.json()) as KanaConfig;
    return parsed;
  };
}

export default Api;
