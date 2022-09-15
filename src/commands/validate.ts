import chalk from "chalk";
import ora from "ora";
import Api from "../api/index.js";

export const validate = async (file: any) => {
  try {
    // soft validation

    // must include features
    if (!file.features?.length) {
      throw "your setup must contain at least one feature!";
    } else {
      ora("Config contains at least one feature.").succeed();
    }

    file.packages.draft = file.packages?.draft ?? [];
    file.packages.published = file.packages?.published ?? [];
    const allPackages = [...file.packages.draft, ...file.packages.published];

    // must include packages
    if (!allPackages.length) {
      throw "your setup must contain at least one package!";
    } else {
      ora("Config contains at least one package.").succeed();
    }

    const featureIds = file.features.map((f: any) => f.id);

    // must not have features with identical IDs
    if (featureIds.length > new Set(featureIds).size) {
      throw "duplicate feature IDs are not allowed!";
    } else {
      ora("All feature IDs are unique.").succeed();
    }

    const packagesWithNoFeatures = allPackages.find(
      (p: any) => !p.features || p.features.length < 1
    );

    // must not have packages with null or zero features
    if (packagesWithNoFeatures) {
      throw "all packages must link to at least one feature!";
    } else {
      ora("All packages contain at least one feature").succeed();
    }

    const unlinkedPackageFeatures = allPackages.find((p: any) =>
      p.features.find((f: any) => !featureIds.includes(f.id))
    );

    // must not have package features link to undefined feature IDs
    if (unlinkedPackageFeatures) {
      throw "all package features must link to a defined feature!";
    } else {
      ora("All package features link to an existing feature.").succeed();
    }

    const consumablePackageFeatureLimitUndefined = allPackages.find((p: any) =>
      p.features.find((f1: any) => {
        const isConsumable = file.features.find((f2: any) => f2.id === f1.id);
        if (isConsumable) {
          return f1.limit !== null || isNaN(f1.limit);
        } else {
          return true;
        }
      })
    );

    // must not have package features with limits that are undefined or non-numeric or negative
    if (consumablePackageFeatureLimitUndefined) {
      throw 'all package features of "CONSUMABLE" type must be defined with null or a positive numeric value';
    } else {
      ora("All package features link to an existing feature.").succeed();
    }

    const spinner = ora("Validating...").start();

    const result: any = await Api.validate(file);

    spinner.stop();

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
