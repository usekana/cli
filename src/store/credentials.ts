import inquirer from "inquirer";
import Conf from "conf";
import ora from "ora";
import { getEnvironmentApiKey } from "../constants/index.js";

export const getApiKey = async (isLive: boolean) => {
  let apikey = getEnvironmentApiKey(isLive);

  if (apikey) {
    ora("Loaded API key from environment variable.").info();
    return apikey;
  }

  const config = new Conf();
  apikey = config.get("apikey") as string;

  if (!apikey) {
    const answer = await inquirer.prompt([
      {
        type: "input",
        name: "apikey",
        message: "Please provide your private API key",
      },
    ]);
    apikey = answer.apikey;
    config.set("apikey", apikey);

    if (!apikey) {
      throw "apikey is required";
    }

    ora("Loaded API key from cache.").info();
  }

  return apikey;
};

export const deleteApikey = () => {
  const config = new Conf();
  let apikey = config.delete("apikey");
  console.info("deleted:", apikey);
};
