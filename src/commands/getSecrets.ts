import Conf from "conf";

export const getSecrets = () => {
  const config = new Conf();
  let apikey = config.get("apikey");
  console.log("current API key:", apikey);
};
