import fs from "fs";
import YAML from "yaml";
import { getFileName, KANA_DIR } from "../constants/index.js";
import { KanaConfig } from "../model/index.js";

export const showArt = () => {
  const art = fs.readFileSync(
    new URL("../../assets/art.txt", import.meta.url),
    "utf8"
  );
  console.log(art);
};

export const parseYaml = (data: KanaConfig) => {
  const fDoc = new YAML.Document({ features: data.features });
  const pDoc = new YAML.Document({ packages: data.packages });

  const header = `version: 1.0.0
  
# Updated: ${new Date()}

# PROJECT: ${data.app}
`;

  const fDocStr = YAML.stringify(fDoc);
  const pDocStr = YAML.stringify(pDoc);

  const fComment = `
# FEATURES
`;
  const pComment = `
# PACKAGES
`;

  const result = header + fComment + fDocStr + pComment + pDocStr;

  return result;
};

export const cleanConfig = (data: KanaConfig) => {
  if (data.packages.draft) {
    data.packages.draft = data.packages.draft?.map((p) => {
      const features = p.features.map((f1) => {
        const isConsumable =
          data.features.find((f2: any) => f2.id === f1.id)?.type ===
          "CONSUMABLE";
        return {
          ...f1,
          limit: isConsumable ? f1.limit : undefined,
          overage_enabled: !!f1.overage_enabled
            ? f1.overage_enabled
            : undefined,
        };
      });

      return {
        ...p,
        features: features,
      };
    });
  }

  if (data.packages.published) {
    data.packages.published = data.packages.published?.map((p) => {
      const features = p.features.map((f1) => {
        const isConsumable =
          data.features.find((f2: any) => f2.id === f1.id)?.type ===
          "CONSUMABLE";
        return {
          ...f1,
          limit: isConsumable ? f1.limit : undefined,
          overage_enabled: !!f1.overage_enabled
            ? f1.overage_enabled
            : undefined,
        };
      });

      return {
        ...p,
        features: features,
      };
    });
  }

  return data;
};

export const readKanaFile = (isLive: boolean) => {
  if (!fs.existsSync(KANA_DIR)) {
    fs.mkdirSync(KANA_DIR);
  }

  const fileName = getFileName(isLive);

  const file = fs.readFileSync(fileName, "utf8");

  if (!file) {
    throw `no file "${fileName}" found.`;
  }

  const parsedFile = YAML.parse(file);
  return parsedFile;
};

export const writeToKanaFile = (
  data: KanaConfig,
  isLive: boolean,
  isExample?: boolean
) => {
  const cleanData = cleanConfig(data);

  const yaml = parseYaml(cleanData);

  if (!fs.existsSync(KANA_DIR)) {
    fs.mkdirSync(KANA_DIR);
  }

  fs.writeFileSync(getFileName(isLive, isExample), yaml);
};

export const toPackageArrayFromConfig = (config: KanaConfig) => {
  config.packages.draft = config.packages?.draft ?? [];
  config.packages.published = config.packages?.published ?? [];
  return [...config.packages.draft, ...config.packages.published];
};
