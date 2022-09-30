import chalk from "chalk";
import ora from "ora";
import { KanaConfig } from "../model/index.js";
import { showArt, writeToKanaFile } from "../utils.js/index.js";

export const bootstrap = async () => {
  showArt();

  const spinner = ora("Bootstrapping your new project...").start();

  await new Promise((res) => setTimeout(res, 500));

  const data: KanaConfig = {
    version: "1.0.0",
    app: "My SaaS Business",
    features: [
      {
        id: "dashboard-access",
        name: "Dashboard access",
        type: "BINARY",
      },
      {
        id: "api-calls",
        name: "API calls",
        type: "CONSUMABLE",
      },
    ],
    packages: {
      draft: [],
      published: [
        {
          id: "basic-plan",
          name: "Basic Plan",
          features: [
            {
              id: "dashboard-access",
              limit: null,
            },
            {
              id: "api-calls",
              limit: 10,
              overage_enabled: true,
            },
          ],
        },
        {
          id: "premium-plan",
          name: "Premium Plan",
          features: [
            {
              id: "dashboard-access",
              limit: null,
            },
            {
              id: "api-calls",
              limit: 1000,
              overage_enabled: true,
            },
          ],
        },
      ],
    },
    addons: {
      draft: [],
      published: [],
    },
  };

  spinner.stop();

  writeToKanaFile(data, false, true);

  console.log("\n");
  ora(
    chalk.bold(
      "Local example config successfully generated! Check out your Kana config file at ./kana.example.yaml\n"
    )
  ).succeed();

  console.log("\n");
  ora(
    chalk.white(
      "Once you're happy with your setup, create kana.yaml in the same directory, and copy/paste this configuration. Then run kana publish in your terminal to publish your packages to Kana.\n"
    )
  ).info();
};
