import fs from "fs";
import YAML from "yaml";
import { Api } from "../api/index.js";
import { showArt } from "../utils.js/index.js";

export const pull = async () => {
  showArt();
  const data = await Api.pull();
  const yaml = YAML.stringify(data);
  console.log("\n", yaml, "\n");
  fs.writeFileSync("./kana.yaml", yaml);
  console.log("Done! Check out your Kana config at ./kana.yaml");
};
