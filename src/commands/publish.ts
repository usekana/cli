import fs from "fs";
import YAML from "yaml";
import inquirer from "inquirer";
import { validate } from "./validate.js";
import { cleanConfig, parseYaml, showArt } from "../utils.js/index.js";
import Api from "../api/index.js";
import ora from "ora";
import chalk from "chalk";

export const publish = async (args: { force?: boolean }) => {
  showArt();

  const file = fs.readFileSync("./kana.yaml", "utf8");
  const parsedFile = YAML.parse(file);

  const validation = (await validate(parsedFile)) as {
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
    const spinner = ora("Publishing...").start();

    const data: any = await Api.publish(parsedFile);

    spinner.stop();

    const cleanData = cleanConfig(data);

    const yaml = parseYaml(cleanData);

    fs.writeFileSync("./kana.yaml", yaml);

    console.log("\n");
    ora(chalk.bold("Kana config successfully updated!\n")).succeed();
  }
};
