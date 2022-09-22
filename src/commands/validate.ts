import chalk from "chalk";
import ora from "ora";
import Api from "../api/index.js";
import { KanaConfig } from "../model/index.js";

const toPackageArrayFromConfig = (config: KanaConfig) => {
  config.packages.draft = config.packages?.draft ?? [];
  config.packages.published = config.packages?.published ?? [];
  return [...config.packages.draft, ...config.packages.published];
};

const checkContainsFeatures = (config: KanaConfig) => {
  if (!config.features?.length) {
    throw "your setup must contain at least one feature!";
  } else {
    ora("Config contains at least one feature.").succeed();
  }
};

const checkAllFeatureIdsUnique = (config: KanaConfig) => {
  const featureIds = config.features.map((f: any) => f.id);

  // must not have features with identical IDs
  if (featureIds.length > new Set(featureIds).size) {
    throw "duplicate feature IDs are not allowed!";
  } else {
    ora("All feature IDs are unique.").succeed();
  }
};

const checkContainsPackages = (config: KanaConfig) => {
  config.packages.draft = config.packages?.draft ?? [];
  config.packages.published = config.packages?.published ?? [];
  const allPackages = [...config.packages.draft, ...config.packages.published];

  // must include packages
  if (!allPackages.length) {
    throw "your setup must contain at least one package!";
  } else {
    ora("Config contains at least one package.").succeed();
  }
};

const checkAllPackageFeaturesLinked = (packages: any) => {
  const packagesWithNoFeatures = packages.find(
    (p: any) => !p.features || p.features.length < 1
  );

  // must not have packages with null or zero features
  if (packagesWithNoFeatures) {
    throw "all packages must link to at least one feature!";
  } else {
    ora("All packages contain at least one feature").succeed();
  }
};

const checkAllPackagesContainFeatures = (packages: any) => {
  const packagesWithNoFeatures = packages.find(
    (p: any) => !p.features || p.features.length < 1
  );

  // must not have packages with null or zero features
  if (packagesWithNoFeatures) {
    throw "all packages must link to at least one feature!";
  } else {
    ora("All packages contain at least one feature").succeed();
  }
};

const checkAllConsumableFeaturesHaveLimits = (
  packages: any,
  config: KanaConfig
) => {
  const consumablePackageFeatureLimitUndefined = packages.find((p: any) =>
    p.features.find((f1: any) => {
      const isConsumable =
        config.features.find((f2: any) => f2.id === f1.id)?.type ===
        "CONSUMABLE";

      if (isConsumable) {
        return f1.limit !== null && isNaN(f1.limit);
      } else {
        return false;
      }
    })
  );

  // must not have package features with limits that are undefined or non-numeric or negative
  if (consumablePackageFeatureLimitUndefined) {
    throw 'all package features of "CONSUMABLE" type must be defined with null or a positive numeric value';
  } else {
    ora("All package features link to an existing feature.").succeed();
  }
};

export const validate = async (config: KanaConfig, isLive: boolean) => {
  try {
    checkContainsFeatures(config);
    checkAllFeatureIdsUnique(config);
    checkContainsPackages(config);

    const packages = toPackageArrayFromConfig(config);
    checkAllPackageFeaturesLinked(packages);
    checkAllPackagesContainFeatures(packages);
    checkAllConsumableFeaturesHaveLimits(packages, config);

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
