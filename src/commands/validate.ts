import chalk from "chalk";
import ora from "ora";
import Api from "../api/index.js";
import { KanaConfig } from "../model/index.js";
import { toPackageArrayFromConfig } from "../utils.js/index.js";
import * as Validation from "../utils.js/validation.js";

export const validate = async (config: KanaConfig, isLive: boolean) => {
  try {
    Validation.checkContainsFeatures(config);
    Validation.checkAllFeatureIdsUnique(config);
    Validation.checkContainsPackages(config);

    const packages = toPackageArrayFromConfig(config);

    Validation.checkNoDuplicatePackageIds(packages);
    Validation.checkAllPackagesContainFeatures(packages);
    Validation.checkAllConsumableFeaturesHaveLimits(packages, config);
    Validation.checkAllResetPeriodsAreValid(packages);

    // CORE VALIDATION
    const result: any = await Api.validate(config, isLive);

    result.data.forEach((e: any) => {
      if (e.includes("[ERROR]")) {
        ora(chalk.red(e)).fail();
      } else if (e.includes("[WARNING]")) {
        ora(chalk.yellow(e)).warn();
      } else {
        ora(e).info();
      }
    });

    if (result.data.length === 0) {
      console.log("\n");
      ora(chalk.bold("The local config file is up to date.\n")).succeed();
    }

    return result;
  } catch (error) {
    ora(chalk.red("[ERROR]: " + error)).fail();
    return { error };
  }
};
