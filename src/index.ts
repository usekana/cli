#!/usr/bin/env node
import * as dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import YAML from "yaml";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { bootstrap } from "./commands/bootstrap.js";
import { getSecrets } from "./commands/getSecrets.js";
import { publish } from "./commands/publish.js";
import { pull } from "./commands/pull.js";
import { validate } from "./commands/validate.js";
import { getFileName } from "./constants/index.js";
import { deleteApikey } from "./store/credentials.js";

yargs(hideBin(process.argv))
  .usage("Usage: $0 <command> [options]")
  .boolean("force")
  .alias("force", ["f"])
  .describe("force", "Override errors when publishing kana.yaml")
  .boolean("live")
  .describe(
    "live",
    "Pull or publish config for your live Kana app (default is test)"
  )
  .command("pull", "pull your current kana setup", () => {}, pull)
  .command("publish", "publish your local kana setup", () => {}, publish)
  .command(
    "validate",
    "compare your current setup with your local setup",
    () => {},
    (args) => {
      const isLive = !!args.live;
      const file = fs.readFileSync(getFileName(isLive), "utf8");
      const parsedFile = YAML.parse(file);
      return validate(parsedFile, isLive);
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
