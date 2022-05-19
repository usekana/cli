import fs from "fs";
import YAML from "yaml";
import { api } from "../api/index.js";

export const pull = async () => {
  const art = fs.readFileSync("./assets/art.txt", "utf8");
  console.log(art);

  const data = await api.pull();
  console.log(data);

  const yaml = YAML.stringify(data);
  console.log(yaml);

  fs.writeFileSync("./kana.yaml", yaml);
};
