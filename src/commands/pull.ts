import chalk from "chalk";
import ora from "ora";
import Api from "../api/index.js";
import { showArt, writeToKanaFile } from "../utils.js/index.js";

export const pull = async (args: { live?: boolean }) => {
  const isLive = !!args.live;

  showArt();

  try {
    const data = await Api.pull(isLive);

    writeToKanaFile(data, isLive);

    console.log("\n");
    ora(
      chalk.bold(
        "Local Kana config successfully synced! Check out your Kana config file at ./kana.yaml\n"
      )
    ).succeed();
  } catch (error) {
    ora(chalk.red("[ERROR]: " + error)).fail();
  }
};
