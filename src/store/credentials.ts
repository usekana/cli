import Conf from "conf";
import ora from "ora";
import { getEnvironmentApiKey } from "../constants/index.js";

export const getApiKey = async (isLive: boolean) => {
  let apikey = getEnvironmentApiKey(isLive);

  if (!apikey) {
    const envName = isLive ? "KANA_LIVE_KEY" : "KANA_DEV_KEY";
    throw `apikey is required, please define ${envName} as an environment variable (.env)`;
  }

  ora("Loaded API key from environment variable.").info();
  return apikey;
};

export const deleteApikey = () => {
  const config = new Conf();
  let apikey = config.delete("apikey");
  console.info("deleted:", apikey);
};
