#! /usr/bin/env node

import fs from "fs";
import fetch from "node-fetch";
import YAML from "yaml";
import inquirer from "inquirer";
import yargs from "yargs";
import Conf from "conf";
import chalk from "chalk";

const getData = async (apikey) => {
  return fetch("http://localhost:3380/cli/pull", {
    headers: {
      "Content-Type": "application/json",
      Authorization: apikey,
    },
  });
};

const getApiKey = async () => {
  const config = new Conf();
  let apikey = config.get("apikey");
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
  }

  return apikey;
};

const validate = async (file) => {
  // internal validation
  if (!file.features?.length || !file.packages?.length) {
    return {
      error: "your setup must contain at least one package and feature!",
    };
  }

  const featureIds = file.features.map((f) => f.id);

  if (
    file.packages.find((p) =>
      p.features.find((fid) => !featureIds.includes(fid))
    )
  ) {
    return {
      error: "all package features must link to a defined feature!",
    };
  }

  const packageIds = file.packages.map((p) => p.id);

  if (
    file.packages.find((p) =>
      p.addons?.find((pid) => !packageIds.includes(pid))
    )
  ) {
    return {
      error: "all package addons must link to a defined addon package!",
    };
  }

  const apikey = await getApiKey();

  const result = await fetch("http://localhost:3380/cli/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Version": file.version,
      Authorization: apikey,
    },
    body: JSON.stringify(file),
  });

  const parsedResult = await result.json();

  parsedResult.data.forEach((e) => {
    if (e.includes("[SEVERE]")) {
      console.log(chalk.red(" - " + e));
    } else if (e.includes("[WARNING]")) {
      console.log(chalk.yellow(" - " + e));
    } else {
      console.log(" - " + e);
    }
  });

  return parsedResult;
};

const clear = () => {
  const config = new Conf();
  let apikey = config.delete("apikey");
  console.info("deleted:", apikey);
};

const publish = async (argv) => {
  const file = fs.readFileSync("./kana.yaml", "utf8");
  const parsedFile = YAML.parse(file);

  const validation = await validate(parsedFile);

  if (validation.error) {
    console.log(validation.error);
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: "confirm",
      name: "proceedWithPublication",
      default: false,
      prefix: "\n",
      message:
        "You are about to publish a new Kana setup. This action cannot be undone. Do you wish to continue?",
    },
  ]);
  // console.log(answer);
};

const pull = async () => {
  const apikey = await getApiKey();

  const data = await getData(apikey);

  const json = await data.json();
  console.log(json);
  const yaml = YAML.stringify(json);
  console.log(yaml);

  fs.writeFileSync("./kana.yaml", yaml);
};

const argv = yargs(process.argv.splice(2))
  .usage("Usage: $0 <command> [options]")
  .command("pull", "pull your current kana setup", () => {}, pull)
  .command("publish", "publish your local kana setup", () => {}, publish)
  .command("clear", "clear cache", () => {}, clear)
  .demandCommand(1, 1, "choose a command: pull or publish")
  .strict()
  .help("h")
  .alias("h", "help").argv;

// console.log(argv);
