import fs from "fs";
import YAML from "yaml";
import inquirer from "inquirer";
import { validate } from "./validate.js";
import { api } from "../api/index.js";

export const publish = async () => {
  const art = fs.readFileSync("./assets/art.txt", "utf8");
  console.log(art);

  const file = fs.readFileSync("./kana.yaml", "utf8");
  const parsedFile = YAML.parse(file);

  const validation = await validate(parsedFile);

  if (validation.error) {
    console.log("error: ", validation.error);
    return;
  }

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

  if (proceedWithPublication) {
    const data = await api.publish();
    console.log(data);

    const yaml = YAML.stringify(json);
    console.log(yaml);

    fs.writeFileSync("./kana.yaml", yaml);
  } else {
    console.log("nope");
  }
};
