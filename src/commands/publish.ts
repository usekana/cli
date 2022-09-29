import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import Api from "../api/index.js";
import { KanaConfig } from "../model/index.js";
import { readKanaFile, showArt, writeToKanaFile } from "../utils.js/index.js";
import { validate } from "./validate.js";

export const publish = async (args: { force?: boolean; live?: boolean }) => {
  const isLive = !!args.live;

  showArt();

  const file = readKanaFile(isLive);

  const validation = (await validate(file, isLive)) as {
    data: string[];
    error?: any;
  };

  if (validation.error) {
    return;
  }

  if (validation.data.length === 0) {
    return;
  }

  let canProceed = false;

  const hasErrors = !!validation.data.find((e) => e.includes("[ERROR]"));

  if (!!args.force && hasErrors) {
    const { proceedWithErrors } = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceedWithErrors",
        default: false,
        prefix: "\n",
        message:
          "You are about to publish a new Kana setup with the above issues. This action cannot be undone. Do you wish to continue?",
      },
    ]);
    console.log(proceedWithErrors ? "Yes" : "No");
    canProceed = proceedWithErrors;
  } else if (!!args.force) {
    canProceed = true;
  } else if (!hasErrors) {
    const { proceedWithPublication } = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceedWithPublication",
        default: false,
        prefix: "\n",
        message:
          "You are about to publish a new Kana setup. This action cannot be undone. Do you wish to continue?",
      },
    ]);
    console.log(proceedWithPublication ? "Yes" : "No");
    canProceed = proceedWithPublication;
  } else {
    console.log("\n");
    ora(
      chalk.bold(
        'Config validation failed. Review above error(s) or pass in "--force" ("-f") \n'
      )
    ).info();
  }

  if (canProceed) {
    try {
      const data: KanaConfig = await Api.publish(file, isLive);

      writeToKanaFile(data, isLive);

      console.log("\n");
      ora(chalk.bold("Kana config successfully updated!\n")).succeed();
    } catch (error) {
      ora(chalk.red("[ERROR]: " + error)).fail();
    }
  }
};
