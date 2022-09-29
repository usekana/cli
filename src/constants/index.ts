const getRoot = () => process.env.KANA_DEV_URL ?? "https://api.usekana.com/cli";

export const getRoute = () => ({
  validate: getRoot() + "/validate",
  pull: getRoot() + "/pull",
  publish: getRoot() + "/publish",
});

export const KANA_DIR = "./kana";

const DEV_FILE = KANA_DIR + "/kana.dev.yaml";
const LIVE_FILE = KANA_DIR + "/kana.yaml";
const EXAMPLE_FILE = KANA_DIR + "/kana.example.yaml";

export const getFileName = (isLive: boolean, isExample?: boolean) =>
  isExample ? EXAMPLE_FILE : isLive ? LIVE_FILE : DEV_FILE;

export const getEnvironmentApiKey = (isLive: boolean) =>
  isLive ? process.env.KANA_LIVE_KEY : process.env.KANA_DEV_KEY;
