#!/usr/bin/env node
import fs from "fs";
import YAML from "yaml";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { deleteApikey } from "./store/credentials.js";
import { pull } from "./commands/pull.js";
import { publish } from "./commands/publish.js";
import { validate } from "./commands/validate.js";
import { getSecrets } from "./commands/getSecrets.js";
import chalk from "chalk";
import { bootstrap } from "./commands/bootstrap.js";

yargs(hideBin(process.argv))
  .usage("Usage: $0 <command> [options]")
  .boolean("force")
  .alias("force", ["f"])
  .describe("force", "Override errors when publishing kana.yaml")
  .command("pull", "pull your current kana setup", () => {}, pull)
  .command("publish", "publish your local kana setup", () => {}, publish)
  .command(
    "validate",
    "compare your current setup with your local setup",
    () => {},
    () => {
      const file = fs.readFileSync("./kana.yaml", "utf8");
      const parsedFile = YAML.parse(file);
      return validate(parsedFile);
    }
  )
  .command("bootstrap", "generate an example config file", () => {}, bootstrap)
  .command(
    "clear",
    "clear cache",
    () => {},
    () => deleteApikey()
  )
  .command("secrets", "see current API key", () => {}, getSecrets)
  .demandCommand(1, 1, "choose a command: pull or publish")
  .strict()
  .help("h")
  .alias("h", "help").argv;
