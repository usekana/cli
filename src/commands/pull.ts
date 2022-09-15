import chalk from "chalk";
import fs from "fs";
import ora from "ora";
import Api from "../api/index.js";
import { cleanConfig, parseYaml, showArt } from "../utils.js/index.js";

export const pull = async () => {
  showArt();

  const spinner = ora("Pulling...").start();

  const data = await Api.pull();

  spinner.stop();

  const cleanData = cleanConfig(data);

  const yaml = parseYaml(cleanData);

  fs.writeFileSync("./kana.yaml", yaml);

  console.log("\n");
  ora(
    chalk.bold(
      "Local Kana config successfully synced! Check out your Kana config file at ./kana.yaml\n"
    )
  ).succeed();
};
