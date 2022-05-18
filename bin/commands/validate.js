import chalk from "chalk";
import { api } from "../api/index.js";

export const validate = async (file) => {
  // internal validation
  if (!file.features?.length || !file.packages?.length) {
    return {
      error: "your setup must contain at least one package and feature!",
    };
  }

  const featureIds = file.features.map((f) => f.id);

  if (featureIds.length > new Set(featureIds).size) {
    return {
      error: "duplicate feature IDs are not allowed!",
    };
  }

  if (
    file.packages.find((p) =>
      p.features.find((f) => !featureIds.includes(f.id))
    )
  ) {
    return {
      error: "all package features must link to a defined feature!",
    };
  }

  const packageIds = file.packages.map((p) => p.id);

  if (
    file.packages.find((p) =>
      p.addons?.find((pid) => !packageIds.includes(pid))
    )
  ) {
    return {
      error: "all package addons must link to a defined addon package!",
    };
  }

  const result = await api.validate();

  result.data.forEach((e) => {
    if (e.includes("[SEVERE]")) {
      console.log(chalk.red(" - " + e));
    } else if (e.includes("[WARNING]")) {
      console.log(chalk.yellow(" - " + e));
    } else {
      console.log(" - " + e);
    }
  });

  return result;
};
