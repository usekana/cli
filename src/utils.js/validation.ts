import ora from "ora";
import { KanaConfig } from "../model";

export const checkContainsFeatures = (config: KanaConfig) => {
  if (!config.features?.length) {
    throw "your setup must contain at least one feature!";
  } else {
    ora("Config contains at least one feature.").succeed();
  }
};

export const checkAllFeatureIdsUnique = (config: KanaConfig) => {
  const featureIds = config.features.map((f: any) => f.id);

  // must not have features with identical IDs
  if (featureIds.length > new Set(featureIds).size) {
    throw "duplicate feature IDs are not allowed!";
  } else {
    ora("All feature IDs are unique.").succeed();
  }
};

export const checkContainsPackages = (config: KanaConfig) => {
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

export const checkNoDuplicatePackageIds = (packages: any) => {
  const packageIds = packages.map((p: any) => p.id);
  const idSet = new Set(packageIds);

  // must not have packages with null or zero features
  if (idSet.size < packageIds.length) {
    throw "all package IDs must be unique!";
  } else {
    ora("All package IDs are unique").succeed();
  }
};

export const checkAllPackagesContainFeatures = (packages: any) => {
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

export const checkAllResetPeriodsAreValid = (packages: any) => {
  const packageWithInvalidResetPeriod = packages
    .flatMap((p: any) => p.features)
    .find(
      (pof: any) =>
        !!pof.reset_period &&
        !["DAY", "MONTH", "YEAR"].includes(pof.reset_period)
    );

  // all package feature reset periods must be in the correct format
  if (packageWithInvalidResetPeriod) {
    throw 'package feature reset periods must be "DAY", "MONTH", or "YEAR"!';
  } else {
    ora("All packages feature reset periods are valid").succeed();
  }
};

export const checkAllConsumableFeaturesHaveLimits = (
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
