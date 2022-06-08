import fetch from "node-fetch";
import { route } from "../constants/index.js";
import { KanaConfig } from "../model/index.js";
import { getApiKey } from "../store/credentials.js";

const getHeaders = async () => ({
  "Content-Type": "application/json",
  Authorization: await getApiKey(),
});

export namespace Api {
  export const validate = async (file: any) =>
    fetch(route.validate, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(file),
    }).then((data) => data.json());

  export const publish = async (file: any) => {
    const data = await fetch(route.publish, {
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(file),
    }).catch();
    const parsed = (await data.json()) as KanaConfig;
    return parsed;
  };

  export const pull = async () => {
    const data = await fetch(route.pull, {
      headers: await getHeaders(),
    }).catch();
    const parsed = (await data.json()) as KanaConfig;
    return parsed;
  };
}
