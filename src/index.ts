#!/usr/bin/env node

import yargs from "yargs";
import { deleteApikey } from "./store/credentials.js";
import { pull } from "./commands/pull.js";
import { publish } from "./commands/publish.js";
import { validate } from "./commands/validate.js";
import { getSecrets } from "./commands/getSecrets.js";

const clear = () => deleteApikey();

const argv = yargs(process.argv.splice(2))
  .usage("Usage: $0 <command> [options]")
  .command("pull", "pull your current kana setup", () => {}, pull)
  .command("publish", "publish your local kana setup", () => {}, publish)
  .command(
    "validate",
    "compare your current setup with your local setup",
    () => {},
    validate
  )
  .command("clear", "clear cache", () => {}, clear)
  .command("secrets", "see current API key", () => {}, getSecrets)
  .demandCommand(1, 1, "choose a command: pull or publish")
  .strict()
  .help("h")
  .alias("h", "help").argv;
