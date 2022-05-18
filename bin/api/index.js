import fetch from "node-fetch";
import { route } from "../constants/index.js";
import { getApiKey } from "../store/credentials.js";

export const api = {
  validate: async () =>
    fetch(route.validate, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Version": file.version,
        Authorization: await getApiKey(),
      },
      body: JSON.stringify(file),
    }).then((data) => data.json()),
  publish: async () =>
    fetch(route.publish, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Version": file.version,
        Authorization: await getApiKey(),
      },
      body: JSON.stringify(parsedFile),
    }).then((data) => data.json()),
  pull: async () =>
    fetch(route.pull, {
      headers: {
        "Content-Type": "application/json",
        Authorization: await getApiKey(),
      },
    }).then((data) => data.json()),
};
